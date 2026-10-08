import { cn } from '@/lib/utils'

const logoBox = 'grid size-11 flex-none place-items-center'

/** Simplified, illustrative marks for the integration-planning grid. */
export function IntegrationLogo({ name }: { name: string }) {
  switch (name) {
    case 'Datadog':
      return (
        <svg className={cn(logoBox, 'rounded-md bg-[#f5f0fa] text-[#632ca6]')} viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M10 21.5 13.1 11l6.7 2.1 3.4-5.5 6.1 3.8-3.2 5.1 6.7 2.1-3.2 10.1-8.4-2.6-3.2 5.1-6.1-3.8 3.2-5.1-8.4-2.6Z"
            fill="currentColor"
          />
          <circle cx="20.4" cy="18.2" r="1.2" fill="#111318" />
          <circle cx="25.2" cy="19.7" r="1.2" fill="#111318" />
        </svg>
      )
    case 'Slack':
      return (
        <svg className={cn(logoBox, 'rounded-md bg-[#fffffff0]')} viewBox="0 0 40 40" aria-hidden="true">
          {[
            ['M12 7v10m0-5h5', '#36C5F0'],
            ['M33 12H23m5 0v5', '#2EB67D'],
            ['M28 33V23m0 5h-5', '#ECB22E'],
            ['M7 28h10m-5 0v-5', '#E01E5A'],
          ].map(([d, stroke]) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
            />
          ))}
        </svg>
      )
    case 'Salesforce':
      return (
        <svg className={cn(logoBox, 'text-[#00a1e0]')} viewBox="0 0 48 40" aria-hidden="true">
          <path
            d="M14.2 31.5a9 9 0 0 1-2.6-17.6 12.3 12.3 0 0 1 22.9-2.2 9.2 9.2 0 0 1 2.2 18.9H14.2Z"
            fill="currentColor"
          />
          <text
            x="24"
            y="26"
            textAnchor="middle"
            fill="#fff"
            fontSize="8"
            fontWeight="700"
            fontFamily="Arial, sans-serif"
          >
            salesforce
          </text>
        </svg>
      )
    case 'HubSpot':
      return (
        <svg className={cn(logoBox, 'text-[#ff7a59]')} viewBox="0 0 40 40" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3.5">
            <path d="M19 15 29 8m-9 12L9 29m12-11 9 10M20 18V7" />
          </g>
          <circle cx="19" cy="19" r="6" fill="currentColor" />
          <circle cx="30" cy="7" r="4" fill="currentColor" />
          <circle cx="8" cy="30" r="4" fill="currentColor" />
          <circle cx="31" cy="29" r="4" fill="currentColor" />
          <circle cx="20" cy="6" r="3" fill="currentColor" />
        </svg>
      )
    case 'Stripe':
      return (
        <svg className={cn(logoBox, 'text-[#635bff]')} viewBox="0 0 48 40" aria-hidden="true">
          <path
            d="M23.7 16.2c-3.1-1.1-4.8-1.8-4.8-3 0-1 .8-1.5 2.3-1.5 2.7 0 6.1.9 8.8 2.4V5.8a21 21 0 0 0-8.8-1.9c-7.2 0-12 3.8-12 10 0 9.8 13.5 8.2 13.5 12.4 0 1.3-1.1 1.9-2.9 1.9-2.5 0-6.6-1.2-9.6-2.9v8.4a24 24 0 0 0 9.6 2.1c7.4 0 12.5-3.7 12.5-10.1 0-10.5-13.5-8.7-13.5-12.5Z"
            fill="currentColor"
            transform="translate(2 1) scale(.9)"
          />
        </svg>
      )
    case 'Zendesk':
      return (
        <svg className={cn(logoBox, 'text-[#17494d]')} viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M5 8h15L5 25V8Zm30 24H20l15-17v17ZM20 8h15L20 25V8ZM5 32h15L5 15v17Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'Tableau':
      return (
        <svg className={cn(logoBox, 'text-[#2c6b9a]')} viewBox="0 0 40 40" aria-hidden="true">
          <g fill="currentColor">
            <path d="M18 3h4v10h-4zM15 7h10v3H15zM18 27h4v10h-4zM15 30h10v3H15z" />
            <path d="M3 18h10v4H3zM7 15h3v10H7zM27 18h10v4H27zM30 15h3v10h-3z" />
            <path d="M18.5 17h3v6h-3zM17 18.5h6v3h-6z" />
            <circle cx="9" cy="9" r="2" />
            <circle cx="31" cy="9" r="2" />
            <circle cx="9" cy="31" r="2" />
            <circle cx="31" cy="31" r="2" />
          </g>
        </svg>
      )
    case 'Snowflake':
      return (
        <svg className={cn(logoBox, 'text-[#29b5e8]')} viewBox="0 0 40 40" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
            <path d="M20 4v32M6.1 12l27.8 16M6.1 28l27.8-16" />
            <path d="m16 8 4-4 4 4m-8 24 4 4 4-4M9.8 18l-5.5-1.5L5.7 11m24.5 18 5.5 1.5-1.4 5M9.8 22l-5.5 1.5L5.7 29m24.5-18 5.5-1.5-1.4-5" />
          </g>
        </svg>
      )
    case 'Custom Webhooks':
      return (
        <svg className={cn(logoBox, 'text-brand')} viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M14.5 24.5 11 28a6 6 0 0 1-8.5-8.5l7-7A6 6 0 0 1 18 13m7 2.5 3.5-3.5a6 6 0 0 1 8.5 8.5l-7 7A6 6 0 0 1 22 27m-9 0 14-14"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
            transform="translate(2 1) scale(.9)"
          />
        </svg>
      )
    case 'Retool':
      return (
        <svg className={cn(logoBox, 'text-[#3d6aff]')} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M5 7h13v8H5zm17 0h13v8H22zM5 25h13v8H5zm17-4h13v12H22z" fill="currentColor" />
          <path d="M18 15h4v6h-4zm-4 6h8v4h-8z" fill="currentColor" opacity=".65" />
        </svg>
      )
    default:
      return (
        <span
          aria-hidden="true"
          className={cn(
            logoBox,
            'rounded-lg border border-line-strong bg-raised font-mono text-caption font-medium text-brand-300',
          )}
        >
          API
        </span>
      )
  }
}
