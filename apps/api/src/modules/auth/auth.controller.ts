import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service.js'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginWithGoogle(
    @Body() body: { idToken?: string; googleId?: string; email: string; name: string }
  ) {
    return this.authService.loginWithGoogle(body)
  }

  @Post('phone/send-code')
  @HttpCode(HttpStatus.OK)
  async sendPhoneCode(@Body() body: { phone: string }) {
    return this.authService.sendPhoneOtp(body.phone)
  }

  @Post('phone/verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyPhoneCode(@Body() body: { phone: string; code: string }) {
    return this.authService.verifyPhoneOtp(body.phone, body.code)
  }
}
