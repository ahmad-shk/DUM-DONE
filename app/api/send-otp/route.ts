import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }
    
    // Use Resend or NodeMailer to send email
    // For now, we'll use a simple SMTP approach or log it
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    if (RESEND_API_KEY) {
      // Send via Resend
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'DUM & DONE <noreply@dumanddone.com>',
          to: [email],
          subject: 'Your DUM & DONE Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #D97706; margin: 0;">DUM & DONE</h1>
                <p style="color: #666; margin-top: 5px;">Authentic Chinese Cuisine</p>
              </div>
              
              <div style="background: #FEF3C7; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 20px;">
                <p style="color: #92400E; margin: 0 0 15px 0; font-size: 16px;">Your verification code is:</p>
                <div style="background: white; border-radius: 8px; padding: 20px; display: inline-block;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #D97706;">${otp}</span>
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                This code will expire in 10 minutes.<br>
                If you didn't request this code, please ignore this email.
              </p>
              
              <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  DUM & DONE - Authentic Chinese Home-Style Cooking
                </p>
              </div>
            </div>
          `,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('[v0] Resend API error:', errorData)
        throw new Error('Failed to send email via Resend')
      }
      
      console.log('[v0] OTP email sent via Resend to:', email)
    } else {
      // Fallback: Log OTP for development
      console.log('[v0] ========================================')
      console.log('[v0] OTP for', email, ':', otp)
      console.log('[v0] ========================================')
      console.log('[v0] Note: Set RESEND_API_KEY to enable email sending')
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully' 
    })
  } catch (error: any) {
    console.error('[v0] Error sending OTP:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
