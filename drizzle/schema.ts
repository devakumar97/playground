import * as t from "drizzle-orm/pg-core";

export const users = t.pgTable("users", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  email: t.varchar("email", { length: 256 }).notNull(),
  username: t.varchar("username", { length: 256 }).notNull(),
  name: t.varchar("name", { length: 256 }),

  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
}, (table) => [
  t.uniqueIndex("email_idx").on(table.email),
  t.uniqueIndex("username_idx").on(table.username)
]);

export const userImages = t.pgTable("user_images", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  altText: t.varchar("alt_text", { length: 512 }),
  objectKey: t.varchar("object_key", { length: 512 }).notNull(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
  userId: t.uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }).unique(),
});

export const passwords = t.pgTable("passwords", {
  userId: t.uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  hash: t.varchar("hash", { length: 512 }).notNull(),
});

export const sessions = t.pgTable("sessions", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  expirationDate: t.timestamp("expiration_date", { withTimezone: true }).notNull(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
  userId: t.uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => [
  t.index("sessions_user_id_idx").on(table.userId),
]);

export const notes = t.pgTable("notes", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  title: t.varchar("title", { length: 256 }).notNull(),
  content: t.text("content").notNull(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
  ownerId: t.uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => [
  t.index("notes_owner_id_idx").on(table.ownerId),
  t.index("notes_owner_updated_idx").on(table.ownerId, table.updatedAt),
]);

export const noteImages = t.pgTable("note_images", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  altText: t.varchar("alt_text", { length: 512 }),
  objectKey: t.varchar("object_key", { length: 512 }).notNull(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
  noteId: t.uuid("note_id").notNull().references(() => notes.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => [
  t.index("note_images_note_id_idx").on(table.noteId),
]);

export const permissions = t.pgTable("permissions", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  action: t.varchar("action", { length: 64 }).notNull(),
  entity: t.varchar("entity", { length: 64 }).notNull(),
  access: t.varchar("access", { length: 64 }).notNull(),
  description: t.varchar("description", { length: 512 }).default(""),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
}, (table) => [
  t.uniqueIndex("permissions_unique_idx").on(table.action, table.entity, table.access),
]);

export const roles = t.pgTable("roles", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  name: t.varchar("name", { length: 64 }).notNull(),
  description: t.varchar("description", { length: 512 }).default(""),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
}, (table) => [
  t.uniqueIndex("roles_name_idx").on(table.name),
]);

export const userRoles = t.pgTable("user_roles", {
  userId: t.uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: t.uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
});

export const rolePermissions = t.pgTable("role_permissions", {
  roleId: t.uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permissionId: t.uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
});

export const verifications = t.pgTable("verifications", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  type: t.varchar("type", { length: 64 }).notNull(),
  target: t.varchar("target", { length: 256 }).notNull(),
  secret: t.varchar("secret", { length: 512 }).notNull(),
  algorithm: t.varchar("algorithm", { length: 64 }).notNull(),
  digits: t.integer("digits").notNull(),
  period: t.integer("period").notNull(),
  charSet: t.varchar("char_set", { length: 64 }).notNull(),
  expiresAt: t.timestamp("expires_at", { withTimezone: true }),
}, (table) => [
  t.uniqueIndex("verifications_unique_idx").on(table.target, table.type),
]);

export const connections = t.pgTable("connections", {
  id: t.uuid('id').notNull().primaryKey().defaultRandom(),
  providerName: t.varchar("provider_name", { length: 128 }).notNull(),
  providerId: t.varchar("provider_id", { length: 256 }).notNull(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
  userId: t.uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => [
  t.uniqueIndex("connections_unique_idx").on(table.providerName, table.providerId),
]);

export const passkeys = t.pgTable("passkeys", {
  id: t.varchar("id").primaryKey(),
  aaguid: t.varchar("aaguid", { length: 64 }).notNull(),
  publicKey: t.varchar("public_key").notNull(),
  userId: t.uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  webauthnUserId: t.varchar("webauthn_user_id", { length: 256 }).notNull(),
  counter: t.bigint("counter", { mode: "number" }).notNull(),
  deviceType: t.varchar("device_type", { length: 64 }).notNull(),
  backedUp: t.boolean("backed_up").notNull(),
  transports: t.varchar("transports", { length: 256 }),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
}, (table) => [
  t.index("passkeys_user_id_idx").on(table.userId),
]);