type Props = {
  params: {
    id: string;
  };
};

export default function ChallengeInterface({ params }: Props) {
  return (
    <div>
      <h1>Challenge {params.id}</h1>
    </div>
  );
}
