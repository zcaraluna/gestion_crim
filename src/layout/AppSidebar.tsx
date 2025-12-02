"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  DocsIcon,
  GridIcon,
  HorizontaLDots,
  PageIcon,
  UserCircleIcon,
} from "../icons/index";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Función para obtener items de navegación según el usuario
const getNavItems = (departamentoNombre: string | null | undefined): NavItem[] => {
  const items: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Panel de Control",
      path: "/",
    },
  ];

  // Agregar menú de Informes solo para Criminalística de Campo
  if (departamentoNombre === "Criminalística de Campo") {
    items.push({
      icon: <DocsIcon />,
      name: "Informes",
      subItems: [
        { name: "Listado de Informes", path: "/informes", pro: false },
        { name: "Nuevo Informe", path: "/informes/nuevo", pro: false },
      ],
    });
  }

  items.push(
    {
      icon: <UserCircleIcon />,
      name: "Perfil de Usuario",
      path: "/profile",
    },
    {
      name: "Páginas",
      icon: <PageIcon />,
      subItems: [
        { name: "Página en Blanco", path: "/blank", pro: false },
        { name: "Error 404", path: "/error-404", pro: false },
      ],
    }
  );

  return items;
};

const othersItems: NavItem[] = [
  {
    icon: <BoxCubeIcon />,
    name: "Elementos UI",
    subItems: [
      { name: "Alertas", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Insignia", path: "/badge", pro: false },
      { name: "Botones", path: "/buttons", pro: false },
      { name: "Imágenes", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  // Obtener items de navegación según el departamento del usuario (memoizado para evitar re-renders)
  const navItems = useMemo(() => getNavItems(user?.departamentoNombre || null), [user?.departamentoNombre]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Función para verificar si una ruta está activa
  const isActive = useCallback((path: string) => {
    // Comparación exacta primero
    if (path === pathname) return true;
    
    // Para rutas de informes, verificar si es la ruta exacta o si es una subruta dinámica
    // pero solo para el listado principal
    if (path === '/informes') {
      // Solo activar si estamos exactamente en /informes o en una ruta de detalle /informes/[id]
      // NO activar si estamos en /informes/nuevo
      return pathname === '/informes' || (pathname && pathname.startsWith('/informes/') && !pathname.startsWith('/informes/nuevo'));
    }
    
    return false;
  }, [pathname]);

  // Handler para toggle de submenú
  const handleSubmenuToggle = useCallback((e: React.MouseEvent, index: number, menuType: "main" | "others") => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  }, []);

  // Handler para navegación
  const handleNavigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  // Efecto para abrir submenú si la ruta actual coincide
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });
  }, [pathname, isActive]);

  // Efecto para calcular altura del submenú
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      setTimeout(() => {
        const element = subMenuRefs.current[key];
        if (element) {
          const height = element.scrollHeight || 0;
          setSubMenuHeight((prevHeights) => ({
            ...prevHeights,
            [key]: height,
          }));
        }
      }, 10);
    }
  }, [openSubmenu]);

  // Renderizar un item del menú
  const renderMenuItem = (nav: NavItem, index: number, menuType: "main" | "others") => {
    const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;

    if (nav.subItems) {
      return (
        <li key={nav.name}>
          <button
            type="button"
            onClick={(e) => handleSubmenuToggle(e, index, menuType)}
            className={`menu-item group ${
              isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
            } cursor-pointer ${
              !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
            }`}
          >
            <span
              className={isSubmenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <>
                <span className="menu-item-text">{nav.name}</span>
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </>
            )}
          </button>
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: isSubmenuOpen
                  ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                  : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(subItem.path)}
                      className={`menu-dropdown-item w-full text-left ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      } cursor-pointer`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      );
    }

    return (
      <li key={nav.name}>
        {nav.path && (
          <button
            type="button"
            onClick={() => handleNavigate(nav.path!)}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            } cursor-pointer`}
          >
            <span
              className={
                isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
              }
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </button>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-[99999] border-r border-gray-200 ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <button
          type="button"
          onClick={() => handleNavigate("/")}
          className="cursor-pointer"
        >
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="text-xl font-bold text-gray-800 dark:text-white/90">
              CRIMIGESTOR
            </span>
          ) : (
            <span className="text-lg font-bold text-gray-800 dark:text-white/90">
              CG
            </span>
          )}
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menú"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav, index) => renderMenuItem(nav, index, "main"))}
              </ul>
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Otros"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {othersItems.map((nav, index) => renderMenuItem(nav, index, "others"))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
