"use client";

import { gql } from "@/features/api/__generated__";
import type { GetPeopleQueryQuery } from "@/features/api/__generated__/graphql";
import { ExternalLink } from "@/ui/text/ExternalLink";
import { explorerUrlForIpa } from "@/utils/storyprotocol";
import { useSuspenseQuery } from "@apollo/client";

const GET_PEOPLE_QUERY = gql(`
query GetPeopleQuery {
  accounts {
    results {
      id
      bio
      name
      profileImageUrl
      likenessIPAssetAddress
    }
  }
}
`);

export default function DiscoverPeoplePage() {
  const { data } = useSuspenseQuery<GetPeopleQueryQuery>(GET_PEOPLE_QUERY);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl my-8">The Talent That AI Can't Replicate</h1>

        <p className="text-xl">
          Explore our network of professional actors and creatives, each with a
          verified, on-chain identity. Find the authentic human element for your
          next project.
        </p>
      </div>

      <ul className="mt-20 flex flex-row flex-wrap gap-4 justify-between">
        {data.accounts.results.map((person) => {
          return (
            <li key={person.id}>
              <div className="card bg-base-100 w-72 shadow-sm">
                <figure>
                  <img
                    src={
                      person.profileImageUrl ||
                      `https://placehold.co/400?text=${encodeURIComponent(person.name)}`
                    }
                    alt=""
                  />
                </figure>

                <div className="card-body">
                  <h3 className="card-title">{person.name}</h3>

                  <p>
                    {person.bio}
                    {person.likenessIPAssetAddress ? (
                      <>
                        Find them on{" "}
                        <ExternalLink
                          href={explorerUrlForIpa(
                            person.likenessIPAssetAddress,
                          )}
                        >
                          Story
                        </ExternalLink>
                      </>
                    ) : null}
                  </p>

                  <div className="card-actions justify-end">
                    <button type="button" className="btn btn-primary">
                      Contact {person.name.split(" ")[0]}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
