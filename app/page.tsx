import About from "./components/About";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectsTeaser from "./components/ProjectsTeaser";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Experience />
        <ProjectsTeaser />
        <About />
      </main>
      <Footer />
    </>
  );
}
