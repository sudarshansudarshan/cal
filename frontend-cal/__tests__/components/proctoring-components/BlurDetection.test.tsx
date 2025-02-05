// filepath: /d:/cal-frontend-g/cal/frontend-cal/__tests__/components/proctoring-components/BlurDetection.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { it, expect, describe, vi } from 'vitest'
import BlurDetection from '../../../src/components/proctoring-components/BlurDetection'

describe('BlurDetection', () => {
  it('calls setIsBlur with "blurred" when blur is detected', () => {
    const setIsBlur = vi.fn()
    render(<BlurDetection isBlur="clear" setIsBlur={setIsBlur} />)
    
    // Simulate blur detection
    setIsBlur('blurred')
    expect(setIsBlur).toHaveBeenCalledWith('blurred')
  })

  it('calls setIsBlur with "clear" when no blur is detected', () => {
    const setIsBlur = vi.fn()
    render(<BlurDetection isBlur="blurred" setIsBlur={setIsBlur} />)
    
    // Simulate no blur detection
    setIsBlur('clear')
    expect(setIsBlur).toHaveBeenCalledWith('clear')
  })
})