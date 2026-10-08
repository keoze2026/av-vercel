import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowRight, Menu, MonitorPlay, Sparkles } from 'lucide-react'
import { AvortyxMark } from '@/components/AvortyxMark'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { products } from '@/data/products'
import { companyLinks, resourceLinks, sectionLinks, type NavLink } from '@/data/site'
import { cn } from '@/lib/utils'
import { scrollToTop, useGoToSection } from '@/lib/motion'

const trigger = cn(
  navigationMenuTriggerStyle(),
  'h-9 rounded-md bg-transparent px-3 text-sm font-normal text-fg-2 hover:bg-raised hover:text-fg focus:bg-raised data-open:bg-raised data-open:text-fg',
)

function MenuLink({ link }: { link: NavLink }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={link.to}
        className="flex flex-col items-start gap-1 rounded-md p-3 hover:bg-raised focus:bg-raised"
      >
        <span className="text-sm font-medium text-fg">{link.label}</span>
        {link.desc && <span className="line-clamp-2 text-caption text-fg-3">{link.desc}</span>}
      </Link>
    </NavigationMenuLink>
  )
}

interface HeaderProps {
  /** Opens the page's assistant; omitted on pages without one. */
  onOpenChat?: () => void
}

export function Header({ onOpenChat }: HeaderProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const goToSection = useGoToSection()
  const [scrolled, setScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const section = (id: string) => {
    setSheetOpen(false)
    goToSection(id)
  }

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:px-4">
      <div
        className={cn(
          'mx-auto flex h-14 max-w-site items-center gap-4 rounded-xl border px-3 pl-4 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-320',
          scrolled
            ? 'border-line bg-canvas/85 shadow-e2'
            : 'border-line-subtle bg-canvas/55',
        )}
      >
        <Link
          to="/"
          aria-label="Avortyx home"
          className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-fg"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault()
              scrollToTop()
            }
          }}
        >
          <AvortyxMark className="size-7" />
          Avortyx
        </Link>

        <NavigationMenu className="mx-auto hidden lg:flex" aria-label="Main navigation">
          <NavigationMenuList className="gap-0.5">
            <NavigationMenuItem>
              <NavigationMenuTrigger className={trigger}>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[720px] grid-cols-[1fr_220px] gap-2 p-2">
                  <ul className="grid grid-cols-2 gap-1">
                    {products.map((p) => (
                      <li key={p.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={`/product/${p.id}`}
                            className="group/item flex h-full flex-row items-start gap-3 rounded-md p-3 hover:bg-raised focus:bg-raised"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-md border border-line bg-raised text-fg-2 group-hover/item:border-brand/40 group-hover/item:text-brand-300 [&_svg]:size-4">
                              <p.icon />
                            </span>
                            <span className="flex min-w-0 flex-col gap-1">
                              <span className="text-sm font-medium text-fg">{p.title}</span>
                              <span className="line-clamp-2 text-caption text-fg-3">{p.desc}</span>
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/#console"
                      onClick={(e) => {
                        e.preventDefault()
                        section('console')
                      }}
                      className="flex flex-col justify-between gap-6 rounded-lg border border-line bg-[radial-gradient(120%_80%_at_100%_0%,rgb(59_130_246/0.18),transparent_60%)] p-4 hover:border-brand/40"
                    >
                      <MonitorPlay className="size-5 text-brand" />
                      <span className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-fg">See the console</span>
                        <span className="text-caption text-fg-3">
                          A simulated view of intent routing, compliance checks and campaign
                          outcomes.
                        </span>
                        <span className="mt-1 inline-flex items-center gap-1 text-caption font-medium text-brand">
                          Open preview <ArrowRight className="size-3.5" />
                        </span>
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {[
              { label: 'Resources', links: resourceLinks },
              { label: 'Company', links: companyLinks },
            ].map((menu) => (
              <NavigationMenuItem key={menu.label}>
                <NavigationMenuTrigger className={trigger}>{menu.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-1 p-2">
                    {menu.links.map((link) => (
                      <li key={link.to}>
                        <MenuLink link={link} />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {sectionLinks.map((s) => (
              <NavigationMenuItem key={s.id}>
                <NavigationMenuLink asChild className={trigger}>
                  <Link
                    to={`/#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      section(s.id)
                    }}
                  >
                    {s.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {onOpenChat && (
              <NavigationMenuItem>
                <button type="button" className={cn(trigger, 'gap-1.5')} onClick={onOpenChat}>
                  <Sparkles className="size-3.5 text-brand" aria-hidden="true" />
                  AI assistant
                </button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="ghost"
            className="hidden h-9 px-3.5 text-fg-2 sm:inline-flex"
            onClick={() => navigate('/company/contact?intent=demo')}
          >
            Get a Demo
          </Button>
          <Button id="get-started" className="h-9 px-3.5" onClick={() => section('pricing')}>
            Get Started
          </Button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="size-9 lg:hidden" aria-label="Open navigation menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 border-line bg-canvas p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-line-subtle px-5 py-4">
                <SheetTitle className="flex items-center gap-2.5 text-base">
                  <AvortyxMark className="size-6" /> Avortyx
                </SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-5 py-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="products" className="border-line-subtle">
                    <AccordionTrigger className="py-4 text-base font-medium hover:no-underline">
                      Products
                    </AccordionTrigger>
                    <AccordionContent className="[&_a]:no-underline">
                      <ul className="flex flex-col gap-1 pb-2">
                        {products.map((p) => (
                          <li key={p.id}>
                            <Link
                              to={`/product/${p.id}`}
                              onClick={() => setSheetOpen(false)}
                              className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-fg-2 hover:bg-raised hover:text-fg"
                            >
                              <p.icon className="size-4 text-fg-3" aria-hidden="true" />
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  {[
                    { id: 'resources', label: 'Resources', links: resourceLinks },
                    { id: 'company', label: 'Company', links: companyLinks },
                  ].map((group) => (
                    <AccordionItem key={group.id} value={group.id} className="border-line-subtle">
                      <AccordionTrigger className="py-4 text-base font-medium hover:no-underline">
                        {group.label}
                      </AccordionTrigger>
                      <AccordionContent className="[&_a]:no-underline">
                        <ul className="flex flex-col gap-1 pb-2">
                          {group.links.map((link) => (
                            <li key={link.to}>
                              <Link
                                to={link.to}
                                onClick={() => setSheetOpen(false)}
                                className="block rounded-md px-2 py-2.5 text-sm text-fg-2 hover:bg-raised hover:text-fg"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="flex flex-col border-t border-line-subtle py-2">
                  {sectionLinks.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => section(s.id)}
                      className="py-3 text-left text-base font-medium text-fg"
                    >
                      {s.label}
                    </button>
                  ))}
                  {onOpenChat && (
                    <button
                      type="button"
                      onClick={() => {
                        setSheetOpen(false)
                        onOpenChat()
                      }}
                      className="inline-flex items-center gap-2 py-3 text-left text-base font-medium text-fg"
                    >
                      <Sparkles className="size-4 text-brand" aria-hidden="true" /> AI assistant
                    </button>
                  )}
                </div>
              </nav>
              <div className="grid gap-2 border-t border-line-subtle p-5">
                <Button size="lg" onClick={() => section('pricing')}>
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setSheetOpen(false)
                    navigate('/company/contact?intent=demo')
                  }}
                >
                  Get a Demo
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
