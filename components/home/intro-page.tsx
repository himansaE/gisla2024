import { IntroComponent } from "./intro";
import { IntroButton } from "./intro-button";

export const IntroPage = () => {
  return (
    <>
      <section className="min-h-[max(500px,100vh)] relative" id="intro">
        <IntroComponent />
      </section>
      <section
        className="w-full h-20 bg-bg-main-2 sticky bottom-0 flex justify-center"
        // onMouseMove={mouseMove}
        // onTouchMove={touchMove}
      >
        <div className="translate-y-[-2.5rem]">
          <IntroButton />
        </div>
      </section>
    </>
  );
};
