import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('service', table => {
    table.increments('id').primary().unsigned()
    table.string('name', 255).notNullable()
  })

  await knex('service').insert([{ name: 'Google' }, { name: 'Apple' }, { name: 'Farcaster' }, { name: 'Telegram' }])

  // Raw request information
  await knex.schema.createTable('raw_signature', table => {
    table.bigIncrements('id').primary().unsigned()
    // extracted EOA address from the signature
    table.string('eoa_address', 40).notNullable().index()
    // id of the user in the external service
    table.string('user_id', 255).notNullable().index()
    table.integer('service_id').unsigned().notNullable().index()

    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()

    table.unique(['user_id', 'service_id'])
    table.foreign('service_id').references('id').inTable('service')
  })

  // Tasks for smart account deployment
  await knex.schema.createTable('deploy_smart_account', table => {
    table.bigIncrements('id').primary().unsigned()
    table.string('status', 255).notNullable().index()
    // EOA address. Cannot deploy 2 times so it is unique
    table.string('eoa_address', 40).notNullable().unique().index()
    // calculated Smart Account address
    table.string('smart_account_address', 40).notNullable().unique().index()
    table.bigint('raw_signature_id').unsigned().notNullable()
    table.text('data', 'longtext').defaultTo('')

    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()

    table.foreign('raw_signature_id').references('id').inTable('raw_signature')
  })

  // Sending Soulbound token to the smart account. For one address, there can be different verification tasks
  await knex.schema.createTable('verify_smart_account', table => {
    table.bigIncrements('id').primary().unsigned()
    table.string('status', 255).notNullable().index()
    table.string('smart_account_address', 40).notNullable().unique().index()
    table.bigint('raw_signature_id').unsigned().notNullable()
    table.text('data', 'longtext').defaultTo('')

    table.datetime('created_at').notNullable()
    table.datetime('updated_at').notNullable()

    table.foreign('raw_signature_id').references('id').inTable('raw_signature')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('verify_smart_account')
  await knex.schema.dropTable('deploy_smart_account')
  await knex.schema.dropTable('raw_signature')
  await knex.schema.dropTable('service')
}
