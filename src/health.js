/*
 * moleculer
 * Copyright (c) 2017 Ice Services (https://github.com/ice-services/moleculer)
 * MIT Licensed
 */

"use strict";

const os = require("os");
const _ = require("lodash");
const { getIpList } = require("./utils");

const _getCpuInfo = () => {
	const load = os.loadavg();
	const cpu = {
		load1: load[0],
		load5: load[1],
		load15: load[2],
		cores: os.cpus().length,
	};
	cpu.utilization = Math.floor(load[0] * 100 / cpu.cores);

	return cpu;
};

const _getMemoryInfo = () => {
	const mem = {
		free: os.freemem(),
		total: os.totalmem()
	};
	mem.percent = (mem.free * 100 / mem.total);

	return mem;
};

const _getOsInfo = () => {
	return {
		uptime: os.uptime(),
		type: os.type(),
		release: os.release(),
		hostname: os.hostname(),
		arch: os.arch(),
		platform: os.platform(),
		user: os.userInfo()
	};
};

const _getProcessInfo = () => {
	return {
		pid: process.pid,
		memory: process.memoryUsage(),
		uptime: process.uptime(),
		argv: process.argv
	};
};

const _getNetworkInterfacesInfo = () => {
	return {
		ip:  getIpList()
	};
};

const _getTransitStatus = (broker) => {
	if (broker.transit) {
		return {
			stat: _.clone(broker.transit.stat)
		};
	}

	return null;
};

const _getDateTimeInfo = () => {
	return {
		now: Date.now(),
		iso: new Date().toISOString(),
		utc: new Date().toUTCString()
	};
};

const _getHealthStatus = (broker) => {
	return {
		cpu: _getCpuInfo(),
		mem: _getMemoryInfo(),
		os: _getOsInfo(),
		process: _getProcessInfo(),
		net: _getNetworkInterfacesInfo(),
		transit: _getTransitStatus(broker),
		time: _getDateTimeInfo(),

		// TODO: event loop & GC info
		// https://github.com/RisingStack/trace-nodejs/blob/master/lib/agent/metrics/apm/index.js
	};
};

module.exports = broker => Promise
	.resolve(_getHealthStatus(broker));
