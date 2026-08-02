leonstrotz.com {
  redir https://www.leonstrotz.com{uri} permanent
}

www.leonstrotz.com {
  encode zstd gzip

  header {
    -Server
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    Referrer-Policy "strict-origin-when-cross-origin"
    Permissions-Policy "camera=(), geolocation=(), microphone=()"
    Strict-Transport-Security "max-age=31536000; includeSubDomains"
  }

  reverse_proxy live-project-dashboard:3000
}
