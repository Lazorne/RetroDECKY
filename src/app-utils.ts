import { SteamClient } from "@decky/ui/dist/globals/steam-client";
import { debounce } from "lodash";

declare var SteamClient: SteamClient;

interface AppOverview {
  m_gameid: string;
  display_name: string;
}

declare var appStore: {
  allApps: AppOverview[];
};

const RETRODECK_APP_NAME = 'RetroDECK';

export function findRetroDECKApp(): AppOverview | undefined {
  return appStore.allApps.find(
    (app) => app.display_name.toLowerCase().trim() === RETRODECK_APP_NAME.toLowerCase().trim()
  );
}

export function startRetroDECK() {
  const app = findRetroDECKApp();
  if (!app) {
    console.warn("RetroDECKY: Could not find RetroDECK app in Steam library");
    return;
  }
  SteamClient.Apps.RunGame(app.m_gameid, "", -1, 100);
}

export const startRetroDECKOnStartup = debounce(startRetroDECK, 200);

