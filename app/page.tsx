import About from "./components/About";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectsTeaser from "./components/ProjectsTeaser";
import ScrollCursor from "./components/ScrollCursor";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollCursor />
      <Header />
      <main className="flex-1">
        <Hero />
        <Experience />
        <ProjectsTeaser />
        <About />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
