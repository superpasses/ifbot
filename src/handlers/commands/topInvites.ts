import { WizardContext } from "telegraf/typings/scenes";
import database from "../../services/database.js";
import { generateInviteLink } from "../../utils/helper.js";

export default async function addAIOHandler(ctx: WizardContext) {
  try {
    const topInviters: {
      userId: string;
      inviteCount: number;
    }[] = await database.getTopInviters();

    if (!topInviters || topInviters.length === 0) {
      await ctx.reply("❌ No invites found.");
      return;
    }
    const userId = ctx.from?.id;
    if (!userId) {
      return;
    }

    const topInvitersString = topInviters
      .map((inviter, index) => {
        const { userId, inviteCount } = inviter;

        return `Θ User Id: ${userId || "Unknown User"}, Invites: ${inviteCount}`;
      })
      .join("\n");

    const resultString = `🏆 Top Inviters 🏆\n\n${topInvitersString}\n\n`;

    await ctx.reply(`\`\`\`swift\n${resultString}\n\`\`\``, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Invite Your Friends",
              callback_data: generateInviteLink(userId.toString(), true),
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Error displaying top inviters:", error);
    await ctx.reply("❌ An error occurred while fetching the leaderboard.");
  }
}
