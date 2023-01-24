import { checkSchemaBodyQueryParamsHook, MissingValidationSchemaError } from '@hooks/index'
import { server } from '@lib/fastify'
import { expect } from 'chai'
import { RouteOptions } from 'fastify'

describe('Schema hooks with fastify', function () {
    describe('checkSchemaBodyQueryParamsHook', () => {
        it('should throw an error if the validation schema is missing', async () => {
            const routeOptions: RouteOptions = { url: '/test', method: 'GET', handler: () => 0}
            await expect(checkSchemaBodyQueryParamsHook(routeOptions)).to.be.rejectedWith(MissingValidationSchemaError)
        })

        it('should throw an error if the body validation schema is missing', async () => {
            const routeOptions: RouteOptions = { url: '/test', method: 'GET', handler: () => 0, schema: {}}
            await expect(checkSchemaBodyQueryParamsHook(routeOptions)).to.be.rejectedWith(MissingValidationSchemaError)
        })

        it('should throw an error if the query validation schema is missing', async () => {
            const routeOptions: RouteOptions = { url: '/test', method: 'GET', handler: () => 0, schema: { body: {}}}
            await expect(checkSchemaBodyQueryParamsHook(routeOptions)).to.be.rejectedWith(MissingValidationSchemaError)
        })

        it('should throw an error if the params validation schema is missing', async () => {
            const routeOptions: RouteOptions = { url: '/test', method: 'GET', handler: () => 0, schema: { body: {}, querystring: '' }}
            await expect(checkSchemaBodyQueryParamsHook(routeOptions)).to.be.rejectedWith(MissingValidationSchemaError)
        })
        it('should not throw an error if the validation schema is present', async () => {
            const routeOptions: RouteOptions = { url: '/test', method: 'GET', handler: () => 0, schema: { body: {}, querystring: '', params: {} }}
            await expect(checkSchemaBodyQueryParamsHook(routeOptions)).to.be.rejectedWith(MissingValidationSchemaError)
        })
    })

})