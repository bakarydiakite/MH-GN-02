import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface NavItem {
  label: string;
  id: string;
  href: string;
}

export const useSectionObserver = (navItems: NavItem[]) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");

  // Handle initial scroll and hash changes
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const currentHash = location.hash.replace("#", "");
    if (currentHash) {
      setActiveSection(currentHash);
      window.requestAnimationFrame(() => {
        const target = document.getElementById(currentHash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }, [location.hash, location.pathname]);

  // Handle active section intersection
  useEffect(() => {
    if (location.pathname !== "/") return undefined;

    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.15, 0.3, 0.5, 0.7],
      }
    );

    sections.forEach((section) => observer.observe(section!));

    return () => {
      sections.forEach((section) => observer.unobserve(section!));
      observer.disconnect();
    };
  }, [location.pathname, navItems]);

  const handleSectionNavigation = (event: React.MouseEvent, item: NavItem) => {
    event.preventDefault();

    if (location.pathname !== "/") {
      navigate(item.href);
      return;
    }

    const target = document.getElementById(item.id);
    if (target) {
      setActiveSection(item.id);
      window.history.replaceState(null, "", item.href);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return { activeSection, handleSectionNavigation };
};
