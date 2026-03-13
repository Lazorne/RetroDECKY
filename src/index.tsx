import {
  staticClasses
} from "@decky/ui";
import {
  definePlugin,
  routerHook,
} from "@decky/api"
import { FaGamepad } from "react-icons/fa";
import { MenuContextProvider } from "./context";
import { PdfViewer } from "./components/pdf-viewer";
import { Menu } from "./components/menu";
import { getSettingBe } from "./backend";
import { SteamClient } from "@decky/ui/dist/globals/steam-client";
import { EUIMode } from "@decky/ui/dist/globals/steam-client/shared";
import { startRetroDECKOnStartup } from "./app-utils";

declare var SteamClient: SteamClient;

function Content() {
  return <MenuContextProvider>
    <Menu />
  </MenuContextProvider>;
}

export default definePlugin(() => {
  console.log("RetroDECKY plugin initializing");

  const uiModeSubscription = SteamClient.UI.RegisterForUIModeChanged((mode) => {
    if (mode !== EUIMode.GamePad) return;

    getSettingBe("autoStartEnabled").then((enabled) => {
      if (!enabled) return;
      startRetroDECKOnStartup();
    });
  });

  routerHook.addRoute("/retrodeck-menu/pdf-viewer", () => {
    return <MenuContextProvider>
      <PdfViewer />
    </MenuContextProvider>;
  });

  return {
    name: "RetroDECKY",
    titleView: <div className={staticClasses.Title}>RetroDECKY</div>,
    content: <Content />,
    icon: <FaGamepad />,
    onDismount() {
      console.log("Unloading");
      uiModeSubscription?.unregister();
      routerHook.removeRoute("/retrodeck-menu/pdf-viewer")
    }
  };
});
