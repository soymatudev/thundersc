//import { PrismaClient } from './../../prisma/generated/prisma-client';
const { PrismaClient } = require('./../../../prisma/generated/prisma');

exports.prisma = new PrismaClient();