import { useSelector, useDispatch } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Version } from 'hooks/useToggledVersion'
import { toggleMenu as _toggleMenu, setVersion as _setVersion, setSwapType as _setSwapType } from './actions'
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

export function useSetVersion() {
  const dispatch = useDispatch<AppDispatch>();
  const versionSet = useSelector<
    AppState,
    AppState['application']['versionSet']
  >((state) => state.application.versionSet);

  const setVersion = (version: Version) =>
    dispatch(_setVersion(version));

  return { versionSet, setVersion };
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
