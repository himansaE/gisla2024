export const RulesText = (props: { hide_heading?: boolean }) => {
  return (
    <div className="mx-4 my-2 flex flex-col gap-3 [&_b]:font-semibold ">
      {props.hide_heading ? (
        <></>
      ) : (
        <h2 className="font-semibold text-xl">
          Gisla AI Art Competition Rules and Regulations
        </h2>
      )}
      <div>
        <div className="flex gap-3 flex-col">
          <div>
            <b>Theme:</b> Art must be under the theme “A Global Call for Climate
            Action”
          </div>

          <div>
            <b>Eligibility:</b> Open to all individuals worldwide with an
            interest in digital AI art and climate change.
          </div>

          <div>
            <b>Artistic Mediums:</b> You have the freedom to use any digital
            platform of your choice, such as Midjourney, Artsmart, or other AI
            art generators.
          </div>

          <div>
            <b>Copyrights:</b> You must be the rightful owner of your artwork.
            Ensure your artworks do not violate any copyrights or intellectual
            property rights of others. You must maintain full ownership of the
            copyrights and intellectual property rights associated with your
            artwork.
          </div>

          <div>
            <b>Voting:</b> During the voting round anyone has the freedom to
            vote for their favorite artwork, and fake votes are not permitted.
          </div>

          <div>
            <b>Participant Warranties:</b> You warrant that all information
            provided during submission is true, accurate, and complete. You
            further warrant that your artworks are original and do not contain
            any defamatory, offensive, or illegal content.
          </div>

          <div>
            <b>Disqualification:</b> The competition organizers can disqualify
            anyone who breaks the rules, cheats, or harms the competition&apos;s
            fairness.
          </div>

          <div className="my-4">
            <b>Submission Process:</b>
            <ul className="list-disc ml-10">
              <li>
                You must submit your artwork electronically through the
                designated submission portal.
              </li>
              <li>A maximum of 3 arts per person can be submitted.</li>
              <li>
                You must include a brief description or artist statement
                explaining the inspiration and message behind your artwork.
              </li>
              <li>
                The submission file should be in PNG, PDF, JPG, or JPEG format
                with a minimum resolution of 1280 x 1280 pixels and include a
                project file with layers.
              </li>
              <li>
                Submissions should be made through the official competition
                website.
              </li>
              <li>You will be informed via email if your art is selected.</li>
            </ul>
          </div>

          <div>
            <b>Judge Panel&apos;s Decision:</b> The judge panel&apos;s decision
            is the final decision.
          </div>

          <span className="block my-2">
            <i>
              By submitting your artworks, you confirm that you&apos;ve read,
              understood, and agreed to the rules & regulations stated above.
            </i>
          </span>
        </div>
      </div>
    </div>
  );
};
