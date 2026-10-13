import {  pgTable,serial, text, timestamp, integer, numeric, 
  boolean, jsonb,pgEnum,customType,uniqueIndex,index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const blob = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const historyTypeEnum = pgEnum("history_type", ["updated", "deleted", "created" , "Settlement added" , "Settlement deleted"]);

export const paymentTypeEnum = pgEnum("payment_type", ["expense", "transfer", "income" , "settlement"]);

export const splitTypeEnum = pgEnum("split_type", ["Equally", "percentages", "amounts" , "shares"]);

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
  ownerTokenHash: text("owner_token_hash"),
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
  splitMethod: splitTypeEnum("split_method").default("Equally").notNull(),
  splitDifferent: jsonb("split_different").$type<Record<string, {amt: number; share?: number; percent?:number} >>()
});

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }), // now optional
    eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull().default("Unknown"),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("comments_event_created_idx").on(t.eventId, t.createdAt)]
);

export const settlements = pgTable(
  "settlements",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    fromName: text("from_name").notNull(),   
    toName: text("to_name").notNull(), 
    undoneAt: timestamp("undone_at"),
    undoneBy: text("undone_by"),
    amount: numeric("amount", { precision: 10, scale: 2, mode: "number" }).notNull(),
    markedBy: text("marked_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("settlements_event_idx").on(t.eventId)]
);

export const history = pgTable("history" , {
  id : serial("id").primaryKey(),
  eventID : integer("eventid").notNull().references(()=> events.id , {onDelete : "cascade"}),
  paymentID : integer("payment_id").references(()=> payments.id , {onDelete : "set null"}),
  action : historyTypeEnum("action").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  actorName: text("actor_name"),
  settlementId: integer("settlement_id").references(() => settlements.id, { onDelete: "set null" }),
},
(table) => [
    index("history_event_created_idx").on(
      table.eventID,
      table.createdAt,
      table.id
    ),
  ]
)

export const eventInvites = pgTable("event_invites", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  revokedAt: timestamp("revoked_at"),
});

export const eventMembers = pgTable(
  "event_members",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    sessionTokenHash: text("session_token_hash"), 
    claimedAt: timestamp("claimed_at"),
    isOwner: boolean("is_owner").notNull().default(false),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  },
  (t) => [uniqueIndex("event_members_event_name_idx").on(t.eventId, t.name)]
);

export const recoveryTokens = pgTable("member_recovery_tokens", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => eventMembers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
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

export const historyRelations = relations(history , ({one , many}) => ({
  event : one(events , {fields : [history.eventID] ,references : [events.id] } ),
  payment: one(payments, {
    fields: [history.paymentID],
    references: [payments.id],
  })
}))