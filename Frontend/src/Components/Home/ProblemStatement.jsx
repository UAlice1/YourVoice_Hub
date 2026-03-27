import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    // Woman in distress / emotional pain - by Nik Shuliahin
    url: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=1200&q=85&auto=format&fit=crop",
    alt: "Woman in emotional distress",
  },
  {
    // Two people in supportive counseling conversation - by Priscilla Du Preez
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=85&auto=format&fit=crop",
    alt: "Supportive counseling session",
  },
  {
    // Person using phone / AI support app - by Dylan Ferreira
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=85&auto=format&fit=crop",
    alt: "Person accessing mental health support on mobile",
  },
  {
    // Woman with hope and healing - by Anthony Tran
    url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&q=85&auto=format&fit=crop",
    alt: "Woman experiencing hope and healing",
  },
];

export default function ProblemStatement() {
  const [active, setActive] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const sectionRef = useRef(null);

  // Scroll animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setSlideIndex((prev) => (prev + 1) % SLIDES.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');

        .problem {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          padding: 160px 40px 140px;
          position: relative;
        }

        .problem-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 100px;
          align-items: center;
        }

        @media (max-width: 960px) {
          .problem-inner { grid-template-columns: 1fr; gap: 70px; }
          .problem { padding: 100px 20px; }
        }

        /* LEFT - Large Emotional Slideshow */
        .problem-image {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 40px 110px rgba(15, 76, 117, 0.25);
          height: 720px;
        }

        .problem-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 1s ease, transform 8s ease;
          opacity: ${fade ? 1 : 0};
        }

        /* Slide dots */
        .slide-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .slide-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.5);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .slide-dot.active {
          background: white;
          width: 24px;
        }

        /* RIGHT - Text */
        .problem-content {
          padding-top: 20px;
        }

        .problem-label {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #0f4c75;
          margin-bottom: 20px;
        }

        .problem-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 6.5vw, 72px);
          font-weight: 900;
          line-height: 1.05;
          color: #0a1628;
          margin-bottom: 32px;
          letter-spacing: -0.04em;
        }

        .problem-body {
          font-size: 17.5px;
          line-height: 1.88;
          color: #475569;
          margin-bottom: 48px;
        }

        .problem-highlight {
          color: #0f4c75;
          font-weight: 700;
        }

        .problem-ai-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 42px;
          background: linear-gradient(135deg, #0f4c75, #2dd4bf);
          color: white;
          font-weight: 700;
          font-size: 16px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 16px 50px rgba(15, 76, 117, 0.4);
          transition: all 0.3s ease;
        }

        .problem-ai-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 65px rgba(15, 76, 117, 0.55);
        }
      `}</style>

      <section className="problem" ref={sectionRef}>
        <div className="problem-inner">

          {/* LEFT - Emotional Slides with Rwanda/Africa context */}
          <div className="problem-image">
            <img
              key={slideIndex}
              src={SLIDES[slideIndex].url}
              alt={SLIDES[slideIndex].alt}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            {/* Slide indicator dots */}
            <div className="slide-dots">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`slide-dot ${i === slideIndex ? "active" : ""}`}
                  onClick={() => setSlideIndex(i)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT - Text */}
          <div className="problem-content">
            <div className="problem-label">THE REALITY WE FACE</div>

            <h2 className="problem-title">
              Too many voices<br />
              are still suffering<br />
              in silence
            </h2>

            <p className="problem-body">
              In Rwanda, mental health struggles and gender-based violence affect millions — 
              especially in rural areas. Survivors often face stigma, fear, distance, and lack of 
              confidential support. While institutions like the <span className="problem-highlight">Isange One Stop Center</span> 
              provide vital help, many people never reach them.
              <br /><br />
              <span className="problem-highlight">YourVoice HUB</span> changes this reality. 
              We combine compassionate AI guidance with secure case submission and direct referral 
              to professional counselors and NGOs — making support accessible, private, and culturally 
              sensitive for every Rwandan.
            </p>

            <a href="/AiSupportchart" className="problem-ai-btn">
              🤖 Use Our AI to Heal Now
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
