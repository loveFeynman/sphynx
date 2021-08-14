import useParsedQueryString from './useParsedQueryString'

export enum RouterType {
  sphynx = 'sphynx',
  pancake = 'pancake'
}

export const DEFAULT_ROUTER_TYPE: RouterType = RouterType.sphynx

export default function useRouterType(): RouterType {
  const { use } = useParsedQueryString()
  if (!use || typeof use !== 'string') return RouterType.sphynx
  if (use.toLowerCase() === 'pancake') return RouterType.pancake
  return DEFAULT_ROUTER_TYPE
}
