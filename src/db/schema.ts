import { pgTable, text, timestamp, real, boolean, uuid } from 'drizzle-orm/pg-core';

export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  category: text('category').default('General'),
  studentName: text('studentName').default('Anonymous'),
  contactInfo: text('contactInfo').default('None provided'),
  severity: real('severity').notNull(),
  isHighRisk: boolean('is_high_risk').notNull(),
  status: text('status').default('pending'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});
