import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Add 'networks' column to 'deploy_smart_account'
  await knex.schema.alterTable('deploy_smart_account', table => {
    table.text('networks', 'longtext').defaultTo('').comment('Networks information')
  })

  // Add 'networks' column to 'verify_smart_account'
  await knex.schema.alterTable('verify_smart_account', table => {
    table.text('networks', 'longtext').defaultTo('').comment('Networks information')
  })
}

export async function down(knex: Knex): Promise<void> {
  // Remove 'networks' column from 'deploy_smart_account'
  await knex.schema.alterTable('deploy_smart_account', table => {
    table.dropColumn('networks')
  })

  // Remove 'networks' column from 'verify_smart_account'
  await knex.schema.alterTable('verify_smart_account', table => {
    table.dropColumn('networks')
  })
}
