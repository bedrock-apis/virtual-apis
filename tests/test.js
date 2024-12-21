import { Player } from "../packages/@minecraft/server.native.js";
import { ConfigContextOptions } from "../packages/api.js";
import { CONTEXT } from "../packages/api.js";

CONTEXT.getConfigProperty(ConfigContextOptions.StrictReturnTypes, false);
CONTEXT.onInvocation("Player::sendMessage", (e, s, that, context) => {
    console.log("Sended: ", context);
    context.setResult("Test");
});
const player = Player.create();
console.log(player.sendMessage("Yes"));