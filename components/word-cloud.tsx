'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import * as d3 from 'd3'
import cloud from 'd3-cloud'

interface Word {
  text: string
  value: number
}

interface WordCloudProps {
  words: Word[]
  width?: number
  height?: number
  onWordClick?: (word: string) => void
  selectedWord?: string | null
}

export function WordCloud({ 
  words: wordsProp, 
  width = 400, 
  height = 250, 
  onWordClick,
  selectedWord 
}: WordCloudProps) {
  const words = Array.isArray(wordsProp) ? wordsProp : []
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width, height })

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        setDimensions({
          width: Math.min(containerWidth, 500),
          height: Math.min(containerWidth * 0.6, 280)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Colors for the word cloud - using design system colors
  const colors = useMemo(() => [
    'oklch(0.45 0.15 250)', // primary
    'oklch(0.55 0.18 160)', // accent
    'oklch(0.55 0.15 220)', // info
    'oklch(0.65 0.15 45)',  // chart-3
    'oklch(0.60 0.12 280)', // chart-5
  ], [])

  useEffect(() => {
    if (!svgRef.current || words.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const maxValue = Math.max(...words.map(w => w.value))
    const minValue = Math.min(...words.map(w => w.value))
    
    // Scale font sizes between 12 and 48 based on frequency
    const fontScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([14, 42])

    const layout = cloud<Word>()
      .size([dimensions.width, dimensions.height])
      .words(words.map(w => ({ ...w, size: fontScale(w.value) })))
      .padding(4)
      .rotate(() => 0) // Horizontal text only for readability
      .font('Geist, sans-serif')
      .fontSize(d => d.size || 14)
      .spiral('archimedean')
      .on('end', draw)

    function draw(drawnWords: cloud.Word[]) {
      const g = svg
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
        .append('g')
        .attr('transform', `translate(${dimensions.width / 2},${dimensions.height / 2})`)

      g.selectAll('text')
        .data(drawnWords)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Geist, sans-serif')
        .style('font-weight', d => {
          const word = d as cloud.Word & Word
          return word.text === selectedWord ? '700' : '500'
        })
        .style('fill', (d, i) => {
          const word = d as cloud.Word & Word
          if (word.text === selectedWord) {
            return 'oklch(0.45 0.15 250)' // primary color when selected
          }
          return colors[i % colors.length]
        })
        .style('cursor', onWordClick ? 'pointer' : 'default')
        .style('opacity', d => {
          const word = d as cloud.Word & Word
          if (!selectedWord) return 1
          return word.text === selectedWord ? 1 : 0.4
        })
        .style('transition', 'opacity 0.2s ease, fill 0.2s ease')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .text(d => d.text || '')
        .on('click', (event, d) => {
          if (onWordClick) {
            const word = d as cloud.Word & Word
            onWordClick(word.text)
          }
        })
        .on('mouseover', function() {
          d3.select(this)
            .style('opacity', 1)
            .style('transform', function(d) {
              const word = d as cloud.Word
              return `translate(${word.x},${word.y}) scale(1.1)`
            })
        })
        .on('mouseout', function(_, d) {
          const word = d as cloud.Word & Word
          d3.select(this)
            .style('opacity', !selectedWord || word.text === selectedWord ? 1 : 0.4)
            .style('transform', `translate(${word.x},${word.y}) scale(1)`)
        })
    }

    layout.start()
  }, [words, dimensions, colors, onWordClick, selectedWord])

  if (words.length === 0) {
    return (
      <div 
        ref={containerRef}
        className="flex items-center justify-center h-[200px] text-muted-foreground text-sm"
      >
        No hay datos suficientes para generar la nube de palabras
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} className="w-full" />
    </div>
  )
}
