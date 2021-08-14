import { useSelector, useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { RouterType } from 'hooks/useRouterType'
import { toggleMenu as _toggleMenu, setRouterType as _setRouterType, setSwapType as _setSwapType } from './actions'
import { AppState, AppDispatch } from '../index'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useMenuToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const menuToggled = useSelector<
    AppState,
    AppState['application']['menuToggled']
  >((state) => state.application.menuToggled);

  const toggleMenu = (open: boolean) =>
    dispatch(_toggleMenu(open));

  return { menuToggled, toggleMenu };
}

export function useSetRouterType() {
  const dispatch = useDispatch<AppDispatch>();
  const routerType = useSelector<
    AppState,
    AppState['application']['routerType']
  >((state) => state.application.routerType);

  const setRouterType = (routerType1: RouterType) =>
    dispatch(_setRouterType(routerType1));

  return { routerType, setRouterType };
}

export function useSwapType() {
  const dispatch = useDispatch<AppDispatch>();
  const swapType = useSelector<
    AppState,
    AppState['application']['swapType']
  >((state) => state.application.swapType);

  const setSwapType = (stype: string) =>
    dispatch(_setSwapType(stype));

  return { swapType, setSwapType };
}

export default useBlockNumber
