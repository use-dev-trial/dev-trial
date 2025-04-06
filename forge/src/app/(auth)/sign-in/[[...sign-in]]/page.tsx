import { SignIn } from '@clerk/nextjs';

import { ROUTES } from '@/lib/constants';

export default function SignInPage() {
  return (
    <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center">
      <div className="mx-auto my-auto hidden align-middle md:block">
        <SignIn forceRedirectUrl={ROUTES.CHALLENGES} />
      </div>
      <div className="my-auto block h-[60%] px-3 md:hidden">
        <h1 className="text-center text-2xl font-bold">Welcome to DevTrial</h1>
        <h1 className="text-md my-3 text-center">
          Mobile version is currently under construction. 🚧
        </h1>
        <p className="mt-3 text-center">
          Please sign in using a PC for the best experience. Sorry for the inconvenience.
        </p>
      </div>
    </div>
  );
}
