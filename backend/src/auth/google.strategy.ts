import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly isConfigured: boolean;

  constructor(private authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    const isConfigured = Boolean(clientID && clientSecret && callbackURL);

    super({
      // Use fallback values so application can boot without Google OAuth setup.
      clientID: clientID || 'google-oauth-disabled',
      clientSecret: clientSecret || 'google-oauth-disabled',
      callbackURL: callbackURL || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });

    this.isConfigured = isConfigured;
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    if (!this.isConfigured) {
      throw new ServiceUnavailableException('Google OAuth не настроен');
    }

    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.name?.givenName || '';
    const googleId = profile.id;

    return this.authService.validateGoogleUser({
      email: email || '',
      googleId,
      name,
    });
  }
}
