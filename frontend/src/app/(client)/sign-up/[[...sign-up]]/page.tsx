import { SignUp } from '@clerk/nextjs';

function SignUpPage() {
  return (
    <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-white">
      <div className="my-auto hidden align-middle md:block">
        <SignUp forceRedirectUrl="/challenges" />
      </div>
      <div className="my-auto block h-[60%] px-3 md:hidden">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Welcome to <span className="text-indigo-600">DevTrial</span>
        </h1>
        <h1 className="text-md my-3 text-center text-gray-800">
          Mobile version is currently under construction. 🚧
        </h1>
        <p className="mt-3 text-center text-gray-600">
          Please sign in using a PC for the best experience. Sorry for the inconvenience.
        </p>
      </div>
    </div>
  );
}
export default SignUpPage;
