/**
 * Gerenciador de Seções do Editor
 * Responsável por identificar e substituir seções específicas no laudo
 */

export interface SectionReplacement {
  sectionId: string
  newContent: string
}

export class EditorSectionManager {
  /**
   * Identifica qual seção deve ser atualizada com base no texto ditado
   */
  static identifyTargetSection(
    voiceText: string,
    availableSections: string[]
  ): string | null {
    const lowerText = voiceText.toLowerCase()
    
    // Mapeamento de palavras-chave para seções
    const sectionKeywords: Record<string, string[]> = {
      'tireoide': ['tireoide', 'tireóide', 'lobo', 'istmo', 'volume', 'ecotextura', 'nódulo', 'nódulos'],
      'linfonodos': ['linfonodo', 'linfonodomegalia', 'adenomegalia', 'gânglio', 'cervical', 'nível'],
      'vasos': ['vascularização', 'vascularizacao', 'doppler', 'fluxo', 'carótida', 'vertebral'],
      'impressao': ['impressão', 'impressao', 'conclusão', 'conclusao', 'diagnóstico', 'diagnostico'],
      'indicacao': ['indicação', 'indicacao', 'motivo', 'solicitação']
    }
    
    // Procurar por palavras-chave
    for (const [sectionId, keywords] of Object.entries(sectionKeywords)) {
      if (!availableSections.includes(sectionId)) continue
      
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return sectionId
        }
      }
    }
    
    // Se não identificou, retorna null (adiciona no final)
    return null
  }
  
  /**
   * Substitui o conteúdo de uma seção específica no HTML do editor.
   * Suporta busca por data-section e, como fallback, por headers H1/H2.
   */
  static replaceSectionContent(
    currentHtml: string,
    sectionId: string,
    newContent: string,
    sectionTitles: Record<string, string>,
    lineIndex?: number
  ): string {
    const sectionTitle = sectionTitles[sectionId]
    
    // Criar DOM temporário
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = currentHtml
    
    // 1) Procurar por data-section e garantir quantidade mínima de linhas quando lineIndex for informado
    const replaceParagraphContent = (target: HTMLElement | null) => {
      if (!target) return
      const html = newContent.trim()
      if (html.startsWith('<p')) {
        const temp = document.createElement('div')
        temp.innerHTML = html
        const child = temp.querySelector('p')
        if (child) {
          target.innerHTML = child.innerHTML
        } else {
          target.innerHTML = html
        }
      } else {
        target.textContent = html
      }
    }

    if (lineIndex !== undefined) {
      const existing = Array.from(
        tempDiv.querySelectorAll<HTMLElement>(`[data-section="${sectionId}"]`)
      )

      if (existing.length < lineIndex) {
        const missing = lineIndex - existing.length
        const frag = document.createDocumentFragment()
        for (let i = 0; i < missing; i++) {
          const p = document.createElement('p')
          p.setAttribute('data-section', sectionId)
          p.innerHTML = '&nbsp;'
          frag.appendChild(p)
        }

        const anchor = existing[existing.length - 1]
        if (anchor && anchor.parentElement) {
          anchor.parentElement.insertBefore(frag, anchor.nextSibling)
        } else {
          tempDiv.appendChild(frag)
        }
      }

      const updatedList = Array.from(
        tempDiv.querySelectorAll<HTMLElement>(`[data-section="${sectionId}"]`)
      )
      const target = updatedList[lineIndex - 1] || null
      replaceParagraphContent(target)
      return tempDiv.innerHTML
    }

    const targetByData = tempDiv.querySelector(
      `[data-section="${sectionId}"]`
    ) as HTMLElement | null
    if (targetByData) {
      replaceParagraphContent(targetByData)
      return tempDiv.innerHTML
    }
    
    // 2) Fallback: procurar header
    if (!sectionTitle) {
      tempDiv.innerHTML += `<p data-section="${sectionId}">${newContent}</p>`
      return tempDiv.innerHTML
    }
    
    const headers = tempDiv.querySelectorAll('h2')
    let targetHeader: HTMLElement | null = null
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i] as HTMLElement
      if (header.textContent?.trim().toUpperCase() === sectionTitle.toUpperCase()) {
        targetHeader = header
        break
      }
    }
    
    if (!targetHeader) {
      tempDiv.innerHTML += `<p data-section="${sectionId}">${newContent}</p>`
      return tempDiv.innerHTML
    }
    
    // Encontrar o próximo <h2> (início da próxima seção)
    let nextHeader: HTMLElement | null = null
    let currentElement = targetHeader.nextElementSibling
    
    while (currentElement) {
      if (currentElement.tagName === 'H2' || currentElement.tagName === 'H1') {
        nextHeader = currentElement as HTMLElement
        break
      }
      currentElement = currentElement.nextElementSibling
    }
    
    // Remover conteúdo entre headers
    currentElement = targetHeader.nextElementSibling
    const elementsToRemove: Element[] = []
    
    while (currentElement && currentElement !== nextHeader) {
      elementsToRemove.push(currentElement)
      currentElement = currentElement.nextElementSibling
    }
    
    elementsToRemove.forEach(el => el.remove())
    
    // Inserir novo conteúdo após o header
    const newContentDiv = document.createElement('div')
    newContentDiv.innerHTML = `<p data-section="${sectionId}">${newContent}</p><br>`
    
    if (nextHeader) {
      nextHeader.before(...Array.from(newContentDiv.childNodes))
    } else {
      targetHeader.after(...Array.from(newContentDiv.childNodes))
    }
    
    return tempDiv.innerHTML
  }
  
  /**
   * Processa texto ditado e atualiza o editor de forma inteligente
   */
  static processVoiceInput(
    currentHtml: string,
    voiceText: string,
    processedContent: string,
    availableSections: string[],
    sectionTitles: Record<string, string>
  ): string {
    // Identificar seção alvo
    const targetSection = this.identifyTargetSection(voiceText, availableSections)
    
    if (!targetSection) {
      // Não identificou seção, adiciona no final
      return currentHtml + '<br>' + processedContent
    }
    
    // Substituir conteúdo da seção
    return this.replaceSectionContent(
      currentHtml,
      targetSection,
      processedContent,
      sectionTitles
    )
  }
}
