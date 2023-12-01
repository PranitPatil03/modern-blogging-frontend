import PageAnimation from "../common/PageAnimation";
import InPageNavigation from "../components/InpageNavigation";

const HomePage = () => {
  return (
    <PageAnimation>
      <section className="h-cover flex justify-center gap-10">
      
        <div className="w-full">
          <InPageNavigation defaultHidden={["treading blogs"]} routes={["home", "treading blogs"]}>
            
            <h1> This is home page </h1>
            <h1> This is treading page </h1>
            
          </InPageNavigation>
        </div>

        <div>

        </div>
        
      </section>
    </PageAnimation>
  )
};

export default HomePage;
