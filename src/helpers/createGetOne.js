// @flow

import R from 'ramda'
import getProjection from './getProjection'
import parseFilter from '../parseFilter'
import { appCode } from '../config'

const debug = require('debug')(`${appCode}:create-get-one`)

export default function createGetOne({
  Model,
  overrideFilter,
  filterFields = {},
  populate,
  checkAuthorization,
}: {
  Model: any,
  overrideFilter?: { [key: string]: any } | Function,
  filterFields?: FilterFields,
  populate: Array<string>,
  checkAuthorization?: Function,
}) {
  return async function getOne(
    obj: any,
    args: any, // Example: { slug }: { slug: string },
    context: any,
    info: any,
  ): Promise<any> {
    try {
      if (checkAuthorization) {
        const error = await checkAuthorization({
          parent: obj, args, context, info,
        })
        debug('checkAuthorization', { context, error })
        if (error) return { error }
      }

      // console.log(JSON.stringify({
      //   obj,
      //   info,
      // }, null, 2))

      let _overrideFilter = overrideFilter || {}

      if (typeof _overrideFilter === 'function') {
        _overrideFilter = await _overrideFilter(context)
      }

      const _mongoFilter = await parseFilter(args, filterFields)

      // Merge MongoFilter parsed from query & override Filter
      const mongoFilter = {
        // keep default filter args but ignore customer filter keys
        ...R.omit(Object.keys(filterFields), args),
        ..._mongoFilter,
        ..._overrideFilter,
      }

      const projection = getProjection({ info, field: 'entity' })
      let q = Model.findOne(mongoFilter).select(projection)
      populate.forEach((field) => {
        if (projection.includes(field)) {
          q = q.populate(field)
        }
      })
      const entity = await q.lean()
      if (entity) return { entity }
      return {
        error: {
          message: 'Canot find entity',
        },
      }
    } catch (error) {
      return {
        error,
      }
    }
  }
}
