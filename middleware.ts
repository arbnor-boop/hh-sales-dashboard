import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth) {
    const [, encoded] = auth.split(' ')
    const decoded = atob(encoded)
    if (decoded === 'arbnor@hh-scg.de:HHSales3!') {
      return NextResponse.next()
    }
  }
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="HH SCG Dashboard"' }
  })
}

export const config = {
  matcher: ['/((?!_next).*)'],
}
