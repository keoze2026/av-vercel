import { useState, type ReactNode } from 'react'
import { ChatWidget, type ChatWidgetProps } from '@/components/ChatWidget'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { CONTACT_EMAIL } from '@/data/site'
import { cn } from '@/lib/utils'

type ChatCopy = Omit<ChatWidgetProps, 'open' | 'onOpenChange'>

interface PageShellProps {
  children: ReactNode
  /** Page assistant copy; without it the nav's "AI assistant" opens an email. */
  chat?: ChatCopy
  mainClassName?: string
}

/** Header, main landmark, footer and the page assistant. */
export function PageShell({ children, chat, mainClassName }: PageShellProps) {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header
        onOpenChat={
          chat ? () => setChatOpen(true) : () => (window.location.href = `mailto:${CONTACT_EMAIL}`)
        }
      />
      <main id="main-content" tabIndex={-1} className={cn('flex-1', mainClassName)}>
        {children}
      </main>
      <Footer />
      {chat && <ChatWidget open={chatOpen} onOpenChange={setChatOpen} {...chat} />}
    </div>
  )
}
