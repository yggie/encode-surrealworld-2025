export default function Home() {
  return (
    <div className="flex flex-col gap-40">
      <div className="p-4 max-w-2xl mx-20 mt-12">
        <h1 className="text-5xl mb-8">
          The Future of Creativity is Human. The Future of Royalties is
          Replicon.
        </h1>

        <p className="text-xl">
          Our AI-powered platform, backed by the blockchain, empowers actors and
          studios to collaborate seamlessly and ensures fair compensation for
          every contribution
        </p>
      </div>

      <div className="p-4 flex flex-row justify-end">
        <div className="max-w-xl mx-20">
          <h2 className="text-4xl mb-8">Own Your Digital Identity</h2>

          <p className="text-xl">
            With Replicon, your contributions to films, games, and other media
            are permanently recorded on the blockchain. Secure your legacy and
            ensure you receive equitable royalties for your work, now and in the
            future
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-row justify-start">
        <div className="max-w-xl mx-20">
          <h2 className="text-4xl mb-8">Level the Playing Field</h2>

          <p className="text-xl">
            You don't need a blockbuster budget to create stunning content. We
            provide the tools and talent to help you produce assets for your
            films and games efficiently and affordably
          </p>
        </div>
      </div>
    </div>
  );
}
