'user client'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'


function DashboardPage() {
  const user = useUser();
  console.log(user);

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
        <main>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default DashboardPage