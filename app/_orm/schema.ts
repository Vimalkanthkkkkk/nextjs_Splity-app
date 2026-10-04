import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  numeric, 
  boolean, 
  jsonb,
  pgEnum,
  customType,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const blob = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const paymentTypeEnum = pgEnum("payment_type", ["expense", "transfer", "income"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").unique(),
  profilePicture: blob("profile_picture"), 
});

export const idempotencyKeys = pgTable(
  "idempotency_keys",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull().unique(),
    operation: text("operation").notNull(),
    resourceId: integer("resource_id"),
    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("idempotency_operation_key_unique").on(
      table.operation,
      table.key
    )
  ]
);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(),
  whoCreated: integer("who_created")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  participants: jsonb("participants").$type<string[]>().notNull().default([]), 
  eventImage: blob("event_image"), 
  currency: text("currency").notNull().default("USD"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  type: paymentTypeEnum("type").notNull(),
  who: integer("who").notNull().references(() => users.id),
  whospayment: text("whospayment").notNull(),
  whatFor: text("what_for").notNull(),
  howMuch: numeric("how_much", { precision: 10, scale: 2 , mode: "number" }).notNull(),
  category: text("category"),
  when: timestamp("when").defaultNow().notNull(),
  notes: text("notes"),
  attachment: blob("attachment"), 
  isSplitEqually: boolean("is_split_equally").default(true).notNull(),
  splitDifferent: jsonb("split_different"),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  paymentsMade: many(payments),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, { fields: [events.whoCreated], references: [users.id] }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  event: one(events, { fields: [payments.eventId], references: [events.id] }),
  payer: one(users, { fields: [payments.who], references: [users.id] }),
}));