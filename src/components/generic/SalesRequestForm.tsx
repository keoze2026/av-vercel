import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CONTACT_EMAIL } from '@/data/site'

const PLANS = ['Not sure yet', 'Guided product demo', 'Starter', 'Growth', 'Enterprise']
const VOLUMES = ['Under 500', '500–5,000', '5,001–25,000', 'More than 25,000', 'Not sure yet']

const field = 'flex min-w-0 flex-col gap-2'
const label = 'text-sm font-medium text-fg-2'
const control = 'h-11 bg-inset px-3 text-base data-[size=default]:h-11 md:text-sm'

/** Builds a mailto: link with the request details; nothing is sent by the site itself. */
export function SalesRequestForm() {
  const [params] = useSearchParams()
  const intent = params.get('intent')
  const [plan, setPlan] = useState(() => {
    const requested = params.get('plan')
    if (requested && PLANS.includes(requested)) return requested
    return intent === 'demo' ? 'Guided product demo' : 'Not sure yet'
  })
  const [volume, setVolume] = useState('Under 500')
  const [mailto, setMailto] = useState('')

  const requestType =
    intent === 'demo'
      ? 'Guided product demo'
      : intent === 'onboarding'
        ? 'Setup / onboarding inquiry'
        : 'Sales inquiry'

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const body = [
      `Request type: ${requestType}`,
      `Plan: ${plan}`,
      `Name: ${data.get('name')}`,
      `Work email: ${data.get('email')}`,
      `Estimated monthly volume: ${volume}`,
      '',
      'How can we help?',
      data.get('details') || 'No additional details provided.',
    ].join('\n')
    const href = `mailto:${CONTACT_EMAIL}?${new URLSearchParams({
      subject: `${requestType} — ${plan}`,
      body,
    })}`
    setMailto(href)
    toast.success('Request prepared', { description: `Opening your email app to send it to ${CONTACT_EMAIL}.` })
    window.location.href = href
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-5 rounded-xl border border-line bg-surface p-6 inner-highlight sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className={field}>
          <Label htmlFor="sales-name" className={label}>
            Full name
          </Label>
          <Input
            id="sales-name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="Alex Morgan"
            className={control}
          />
        </div>
        <div className={field}>
          <Label htmlFor="sales-email" className={label}>
            Work email
          </Label>
          <Input
            id="sales-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="jane@company.com"
            className={control}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className={field}>
          <Label htmlFor="sales-plan" className={label}>
            What are you exploring?
          </Label>
          <Select value={plan} onValueChange={setPlan} name="plan">
            <SelectTrigger id="sales-plan" className={`${control} w-full`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLANS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={field}>
          <Label htmlFor="sales-volume" className={label}>
            Estimated monthly routed calls
          </Label>
          <Select value={volume} onValueChange={setVolume} name="volume">
            <SelectTrigger id="sales-volume" className={`${control} w-full`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOLUMES.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className={field}>
        <Label htmlFor="sales-details" className={label}>
          How can we help? <span className="font-normal text-fg-3">(optional)</span>
        </Label>
        <Textarea
          id="sales-details"
          name="details"
          rows={4}
          maxLength={2000}
          placeholder="Tell us about your routing requirements or what you would like to see in a demo."
          className="min-h-28 resize-y bg-inset px-3 py-2.5 text-base md:text-sm"
        />
      </div>
      <p className="text-caption text-fg-3">
        Submitting opens your email app with a prepared message to {CONTACT_EMAIL}. Nothing is sent
        or stored by this site.
      </p>
      <Button type="submit" size="xl">
        Prepare request
      </Button>
      {mailto && (
        <p role="status" className="rounded-md border border-line bg-raised p-3 text-caption text-fg-2">
          If your email app did not open,{' '}
          <a href={mailto} className="text-brand underline underline-offset-3">
            send your request by email
          </a>
          .
        </p>
      )}
    </form>
  )
}
