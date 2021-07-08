import fp from 'fastify-plugin';
import { createConnection } from 'typeorm';

import User from '../models/user';
import Residence from '../models/residence';
import Building from '../models/building';
import ParkingLot from '../models/parking-lot';
import ParkingSlot from '../models/parking-slot';
import Driver from '../models/driver';
import Vehicle from '../models/vehicle';

import type { FastifyInstance } from 'fastify';

export default fp(
  async (
    fastify: FastifyInstance,
    _: undefined,
    next: (err?: Error) => void,
  ): Promise<void> => {
    try {
      const {
        PGHOST = '127.0.0.1',
        PGPORT = 5432,
        POSTGRES_DB = 'esw',
        POSTGRES_USER = 'esw',
        POSTGRES_PASSWORD = 'esw',
        NODE_ENV = 'development',
        DATABASE_URL,
      } = process.env;
 
      const getConfig = (ssl = false) => {
        const basic = {
          type: 'postgres',
          host: PGHOST,
          url: DATABASE_URL,
          port: +PGPORT,
          username: POSTGRES_USER,
          password: POSTGRES_PASSWORD,
          database: POSTGRES_DB,
          entities: [
            User,
            Residence,
            Building,
            ParkingLot,
            ParkingSlot,
            Driver,
            Vehicle,
          ],
        }

        if (ssl) {
          return {
            ...basic,
            ssl: {
              rejectUnauthorized: false
            }
          }
        }

        return basic;
      }

      const connectionString = getConfig(NODE_ENV === 'production');
      
      // @ts-ignore
      const connection = await createConnection(connectionString);

      fastify.decorate('typeorm', connection);

      next();
    } catch (error) {
      next(error);
    }
  },
  {
    name: 'typeorm',
  },
);
