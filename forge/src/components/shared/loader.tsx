type LoaderProps = {
  text: string;
};

export default function Loader({ text }: LoaderProps) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading {text}...</span>
    </div>
  );
}
