import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { createSchema } from "./schema";
import { getPendingOrders } from "./queries/order_queries";
import { sendSlackMessage } from "./slack";

async function main() {
  const db = await open({
    filename: "ecommerce.db",
    driver: sqlite3.Database,
  });

  await createSchema(db);

  const overdueOrders = await getPendingOrders(db, 3);

  if (overdueOrders.length === 0) {
    console.log("No overdue pending orders found.");
    return;
  }

  const lines = overdueOrders.map(
    (o) =>
      `• Order ${o.order_id} — ${o.customer_name} (${o.phone ?? "no phone"}) — pending ${Math.floor(o.days_since_created)} days`,
  );

  const message = `*Overdue Pending Orders (>3 days)*\n` + lines.join("\n");

  await sendSlackMessage("#order-alerts", message);
  console.log(`Sent alert for ${overdueOrders.length} overdue order(s).`);
}

main();
