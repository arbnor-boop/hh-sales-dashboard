"use client";
import React, { useState, useMemo, useEffect } from "react";

const SHEET_URL = "/api/sheet";

async function fetchSheet() {
  const res = await fetch(SHEET_URL + "?t=" + Date.now(), {cache: "no-store"});
  return res.text();
}

const INTERN_PARTNERS = new Set([
  "ZELLGUT GmbH","Grundl Leadership","Schippke","HH SCG",
  "Nuhi Consulting","White Immobilien","KHPH AG","Peak",
  "Hamann & Kollegen Immobilien GmbH","Candidate-flow"
]);
function isInternCloser(setter: string): boolean {
  const s = setter.trim().replace(/\s+/g," ");
  const SETTER_NAMES = ["Montano","Cem","Yves","Mert","Kada","Sören","Rene","Daniel","Petrit","Henrik"];
  return SETTER_NAMES.some(n => n.toLowerCase() === s.toLowerCase());
}

function isInternPartner(name: string): boolean {
  const n = name.trim().replace(/\s+/g," ");
  return INTERN_PARTNERS.has(n) || INTERN_PARTNERS.has(decodeHtml(n));
}

const SETTER = ["Montano","Cem","Yves","Mert","Kada","Sören","Rene"];

type Deal = {
  datum:string; monat:string; partner:string;
  total:number; ersteRate:number; intern:boolean; setter:string;
  scgVol:number; scgCash:number; internVol:number; internCash:number;
  externVol:number; externCash:number;
  montano:number; cem:number; yves:number; mert:number; kada:number; soeren:number; rene:number;
};

const DEALS: Deal[] = [
  {datum:"02.01.2026",monat:"Januar 2026",partner:"Schippke",total:11500.0,ersteRate:11500.0,intern:true,setter:"Vanessa",scgVol:1150.0,scgCash:1150.0,internVol:0.0,internCash:0.0,externVol:1150.0,externCash:1150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.01.2026",monat:"Januar 2026",partner:"Schippke",total:20500.0,ersteRate:20500.0,intern:true,setter:"Vanessa",scgVol:2050.0,scgCash:2050.0,internVol:0.0,internCash:0.0,externVol:2050.0,externCash:2050.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:2006.72,ersteRate:167.23,intern:true,setter:"Michaela S",scgVol:200.67,scgCash:16.72,internVol:0.0,internCash:0.0,externVol:200.67,externCash:16.72,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1680.67,ersteRate:1680.67,intern:true,setter:"Kada",scgVol:336.13,scgCash:336.13,internVol:336.13,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"02.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4369.75,ersteRate:4369.75,intern:true,setter:"Michaela S",scgVol:436.97,scgCash:436.97,internVol:0.0,internCash:0.0,externVol:436.97,externCash:436.97,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.01.2026",monat:"Januar 2026",partner:"MBA",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:750.0,scgCash:125.0,internVol:0.0,internCash:0.0,externVol:750.0,externCash:125.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:7000.0,ersteRate:7000.0,intern:true,setter:"Rene",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:525.0},
  {datum:"05.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1260.5,ersteRate:420.17,intern:true,setter:"Michaela S",scgVol:126.05,scgCash:42.02,internVol:0.0,internCash:0.0,externVol:126.05,externCash:42.02,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1680.67,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:168.07,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:168.07,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1680.67,ersteRate:167.23,intern:true,setter:"Kada",scgVol:336.13,scgCash:33.45,internVol:336.13,internCash:33.45,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:8.36,soeren:0.0,rene:0.0},
  {datum:"05.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:4000.0,ersteRate:4000.0,intern:false,setter:"Christian",scgVol:400.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.01.2026",monat:"Januar 2026",partner:"MBA",total:18000.0,ersteRate:18000.0,intern:false,setter:"Sülei",scgVol:2250.0,scgCash:2250.0,internVol:0.0,internCash:0.0,externVol:2250.0,externCash:2250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:9900.0,ersteRate:9900.0,intern:true,setter:"Marvin",scgVol:396.0,scgCash:396.0,internVol:0.0,internCash:0.0,externVol:396.0,externCash:396.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:5490.0,ersteRate:5490.0,intern:true,setter:"Sören",scgVol:1098.0,scgCash:1098.0,internVol:1098.0,internCash:1098.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:411.75,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4400.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:396.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:396.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"Temmer",total:35000.0,ersteRate:35000.0,intern:false,setter:"Sülei",scgVol:3325.0,scgCash:3325.0,internVol:0.0,internCash:0.0,externVol:3325.0,externCash:3325.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:300.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:300.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:180.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:180.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:5000.0,ersteRate:5000.0,intern:true,setter:"Jochen",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:2490.72,ersteRate:2490.72,intern:true,setter:"Rene",scgVol:498.14,scgCash:498.14,internVol:498.14,internCash:498.14,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:186.8},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:3480.72,ersteRate:290.06,intern:true,setter:"Sören",scgVol:696.14,scgCash:58.01,internVol:696.14,internCash:58.01,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:21.75,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Schippke",total:14000.0,ersteRate:14000.0,intern:true,setter:"Cem",scgVol:3500.0,scgCash:3500.0,internVol:3500.0,internCash:3500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1120.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10850.0,ersteRate:10850.0,intern:false,setter:"Christian",scgVol:1085.0,scgCash:1085.0,internVol:0.0,internCash:0.0,externVol:1085.0,externCash:1085.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5294.12,ersteRate:5294.12,intern:true,setter:"Kada",scgVol:1058.82,scgCash:1058.82,internVol:1058.82,internCash:1058.82,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:264.71,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:25920.0,ersteRate:25920.0,intern:true,setter:"Sören",scgVol:5184.0,scgCash:5184.0,internVol:5184.0,internCash:5184.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:1944.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:36000.0,ersteRate:4000.0,intern:false,setter:"Emil",scgVol:3600.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:16400.0,ersteRate:16400.0,intern:false,setter:"Emil",scgVol:1640.0,scgCash:1640.0,internVol:0.0,internCash:0.0,externVol:1640.0,externCash:1640.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:27.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:27.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:8000.0,ersteRate:2000.0,intern:false,setter:"Emil",scgVol:800.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:800.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:12000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:1200.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.01.2026",monat:"Januar 2026",partner:"Schippke",total:10000.0,ersteRate:5000.0,intern:true,setter:"Cem",scgVol:2500.0,scgCash:1250.0,internVol:2500.0,internCash:1250.0,externVol:0.0,externCash:0.0,montano:0.0,cem:400.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.01.2026",monat:"Januar 2026",partner:"HH SCG",total:60000.0,ersteRate:20000.0,intern:true,setter:"Petrit",scgVol:60000.0,scgCash:20000.0,internVol:60000.0,internCash:20000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1680.67,ersteRate:1680.67,intern:true,setter:"Dominique",scgVol:168.07,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:168.07,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:226.89,soeren:0.0,rene:0.0},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Kada",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:71.43,soeren:0.0,rene:0.0},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1680.67,ersteRate:1680.67,intern:true,setter:"Kada",scgVol:336.13,scgCash:336.13,internVol:336.13,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:151.26,intern:true,setter:"Rene",scgVol:907.56,scgCash:30.25,internVol:907.56,internCash:30.25,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:84.03},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Taim",scgVol:705.88,scgCash:252.1,internVol:0.0,internCash:0.0,externVol:705.88,externCash:252.1,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:746.22,ersteRate:186.55,intern:true,setter:"Lilli",scgVol:74.62,scgCash:18.66,internVol:0.0,internCash:0.0,externVol:74.62,externCash:18.66,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5966.39,ersteRate:5966.39,intern:true,setter:"Lilli",scgVol:596.64,scgCash:596.64,internVol:0.0,internCash:0.0,externVol:596.64,externCash:596.64,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:6000.0,intern:false,setter:"Daniel Bidmon",scgVol:600.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:410.08,intern:true,setter:"Lilli",scgVol:453.78,scgCash:41.01,internVol:0.0,internCash:0.0,externVol:453.78,externCash:41.01,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lilli",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4605.04,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:921.01,scgCash:386.55,internVol:921.01,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:96.64,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:1175.63,intern:true,setter:"Lilli",scgVol:453.78,scgCash:117.56,internVol:0.0,internCash:0.0,externVol:453.78,externCash:117.56,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lilli",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:226.89,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Taim",scgVol:214.29,scgCash:214.29,internVol:0.0,internCash:0.0,externVol:214.29,externCash:214.29,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Yves",scgVol:285.71,scgCash:95.29,internVol:285.71,internCash:95.29,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:23.82,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Yves",scgVol:285.71,scgCash:95.29,internVol:285.71,internCash:95.29,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:23.82,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Lilli",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lilli",scgVol:142.86,scgCash:47.65,internVol:0.0,internCash:0.0,externVol:142.86,externCash:47.65,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:453.78,internVol:0.0,internCash:0.0,externVol:453.78,externCash:453.78,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Schippke",total:11500.0,ersteRate:11500.0,intern:true,setter:"Cem",scgVol:2875.0,scgCash:2875.0,internVol:2875.0,internCash:2875.0,externVol:0.0,externCash:0.0,montano:0.0,cem:920.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:10000.0,ersteRate:2500.0,intern:false,setter:"Emil",scgVol:1000.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5640.0,ersteRate:940.0,intern:true,setter:"Lilli",scgVol:564.0,scgCash:94.0,internVol:0.0,internCash:0.0,externVol:564.0,externCash:94.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Lilli",scgVol:560.0,scgCash:230.0,internVol:0.0,internCash:0.0,externVol:560.0,externCash:230.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:5400.0,intern:true,setter:"Michaela S",scgVol:540.0,scgCash:540.0,internVol:0.0,internCash:0.0,externVol:540.0,externCash:540.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:30000.0,ersteRate:30000.0,intern:false,setter:"Sülei",scgVol:3000.0,scgCash:3000.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:3000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5480.0,ersteRate:2300.0,intern:true,setter:"Kada",scgVol:1096.0,scgCash:460.0,internVol:1096.0,internCash:460.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:115.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:567.0,intern:true,setter:"Kada",scgVol:340.0,scgCash:113.4,internVol:340.0,internCash:113.4,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:28.35,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Yves",scgVol:1120.0,scgCash:460.0,internVol:1120.0,internCash:460.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:115.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Lilli",scgVol:540.0,scgCash:270.0,internVol:0.0,internCash:0.0,externVol:540.0,externCash:270.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5480.0,ersteRate:2300.0,intern:true,setter:"Kada",scgVol:1096.0,scgCash:460.0,internVol:1096.0,internCash:460.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:115.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:567.0,intern:true,setter:"Kada",scgVol:340.0,scgCash:113.4,internVol:340.0,internCash:113.4,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:28.35,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2000.0,intern:true,setter:"Lukas",scgVol:840.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:840.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Lukas",scgVol:810.0,scgCash:405.0,internVol:0.0,internCash:0.0,externVol:810.0,externCash:405.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:6850.0,ersteRate:6850.0,intern:false,setter:"Christian",scgVol:685.0,scgCash:685.0,internVol:0.0,internCash:0.0,externVol:685.0,externCash:685.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:3500.0,ersteRate:3500.0,intern:false,setter:"Christian",scgVol:350.0,scgCash:350.0,internVol:0.0,internCash:0.0,externVol:350.0,externCash:350.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:7020.0,ersteRate:585.0,intern:false,setter:"Christian",scgVol:702.0,scgCash:58.5,internVol:0.0,internCash:0.0,externVol:702.0,externCash:58.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:4680.0,ersteRate:390.0,intern:false,setter:"Christian",scgVol:468.0,scgCash:39.0,internVol:0.0,internCash:0.0,externVol:468.0,externCash:39.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:2000.0,intern:false,setter:"Christian",scgVol:2000.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:12500.0,ersteRate:12500.0,intern:false,setter:"Christian",scgVol:1250.0,scgCash:1250.0,internVol:0.0,internCash:0.0,externVol:1250.0,externCash:1250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:3985.0,ersteRate:3985.0,intern:false,setter:"Christian",scgVol:398.5,scgCash:398.5,internVol:0.0,internCash:0.0,externVol:398.5,externCash:398.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:499.0,ersteRate:499.0,intern:false,setter:"Christian",scgVol:49.9,scgCash:49.9,internVol:0.0,internCash:0.0,externVol:49.9,externCash:49.9,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:2500.0,ersteRate:2500.0,intern:false,setter:"Christian",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Kada",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:20.5,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lilli",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lilli",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Taim",scgVol:705.88,scgCash:289.92,internVol:0.0,internCash:0.0,externVol:705.88,externCash:289.92,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:941.18,scgCash:386.55,internVol:941.18,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:96.64,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lukas",scgVol:680.67,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:680.67,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lukas",scgVol:214.29,scgCash:214.29,internVol:0.0,internCash:0.0,externVol:214.29,externCash:214.29,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Melisa Ince",scgVol:680.67,scgCash:680.67,internVol:0.0,internCash:0.0,externVol:680.67,externCash:680.67,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:20900.0,ersteRate:20900.0,intern:true,setter:"Marvin",scgVol:836.0,scgCash:836.0,internVol:0.0,internCash:0.0,externVol:836.0,externCash:836.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Kada",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:14900.0,ersteRate:7450.0,intern:true,setter:"Marvin",scgVol:596.0,scgCash:298.0,internVol:0.0,internCash:0.0,externVol:596.0,externCash:298.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:453.78,internVol:0.0,internCash:0.0,externVol:453.78,externCash:453.78,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Michaela S",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Michaela S",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:36000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:3600.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Rene",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:84.03},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:1500.0,intern:true,setter:"Michaela S",scgVol:560.0,scgCash:150.0,internVol:0.0,internCash:0.0,externVol:560.0,externCash:150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lukas",scgVol:214.29,scgCash:214.29,internVol:0.0,internCash:0.0,externVol:214.29,externCash:214.29,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Kada",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13600.0,ersteRate:13600.0,intern:true,setter:"Sascha",scgVol:544.0,scgCash:544.0,internVol:0.0,internCash:0.0,externVol:544.0,externCash:544.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:1500.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:135.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:135.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Felix",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Felix",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:2500.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Taim",scgVol:680.67,scgCash:680.67,internVol:0.0,internCash:0.0,externVol:680.67,externCash:680.67,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1000.0,ersteRate:1000.0,intern:true,setter:"Taim",scgVol:150.0,scgCash:150.0,internVol:0.0,internCash:0.0,externVol:150.0,externCash:150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:8000.0,ersteRate:2000.0,intern:false,setter:"Emil",scgVol:800.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:800.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Schippke",total:19500.0,ersteRate:6500.0,intern:true,setter:"Cem",scgVol:4875.0,scgCash:1625.0,internVol:4875.0,internCash:1625.0,externVol:0.0,externCash:0.0,montano:0.0,cem:520.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:941.18,scgCash:386.55,internVol:941.18,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:96.64,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:400.16,intern:true,setter:"Yves",scgVol:285.71,scgCash:80.03,internVol:285.71,internCash:80.03,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:20.01,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lilli",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:400.16,intern:true,setter:"Lilli",scgVol:142.86,scgCash:40.02,internVol:0.0,internCash:0.0,externVol:142.86,externCash:40.02,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Temmer",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2280.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:2280.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:400.16,intern:true,setter:"Lilli",scgVol:142.86,scgCash:40.02,internVol:0.0,internCash:0.0,externVol:142.86,externCash:40.02,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:400.16,intern:true,setter:"Lilli",scgVol:142.86,scgCash:40.02,internVol:0.0,internCash:0.0,externVol:142.86,externCash:40.02,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4789.92,ersteRate:840.34,intern:true,setter:"Rene",scgVol:957.98,scgCash:168.07,internVol:957.98,internCash:168.07,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:42.02},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:5000.0,ersteRate:5000.0,intern:false,setter:"Emil",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:344.61,intern:true,setter:"Lukas",scgVol:738.15,scgCash:51.69,internVol:0.0,internCash:0.0,externVol:738.15,externCash:51.69,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lukas",scgVol:214.29,scgCash:71.47,internVol:0.0,internCash:0.0,externVol:214.29,externCash:71.47,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Rene",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:71.43},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Yves",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:226.89,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:1000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Temmer",total:35000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:3325.0,scgCash:95.0,internVol:0.0,internCash:0.0,externVol:3325.0,externCash:95.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:6000.0,ersteRate:2000.0,intern:true,setter:"Sören",scgVol:1650.0,scgCash:550.0,internVol:1650.0,internCash:550.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:150.0,rene:0.0},
  {datum:"14.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:4500.0,ersteRate:4500.0,intern:true,setter:"Arlind",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Lilli",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lukas",scgVol:680.67,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:680.67,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:1000.0,ersteRate:250.0,intern:false,setter:"Sülei",scgVol:90.0,scgCash:22.5,internVol:0.0,internCash:0.0,externVol:90.0,externCash:22.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:20000.0,intern:false,setter:"Christian",scgVol:2000.0,scgCash:2000.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:2000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Lilli",scgVol:492.1,scgCash:41.01,internVol:0.0,internCash:0.0,externVol:492.1,externCash:41.01,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lilli",scgVol:142.86,scgCash:47.65,internVol:0.0,internCash:0.0,externVol:142.86,externCash:47.65,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lilli",scgVol:142.86,scgCash:47.65,internVol:0.0,internCash:0.0,externVol:142.86,externCash:47.65,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lilli",scgVol:142.86,scgCash:47.65,internVol:0.0,internCash:0.0,externVol:142.86,externCash:47.65,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:907.56,scgCash:386.55,internVol:907.56,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:96.64,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Lilli",scgVol:453.78,scgCash:453.78,internVol:0.0,internCash:0.0,externVol:453.78,externCash:453.78,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lilli",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"Schippke",total:11500.0,ersteRate:11500.0,intern:true,setter:"Vanessa",scgVol:1150.0,scgCash:1150.0,internVol:0.0,internCash:0.0,externVol:1150.0,externCash:1150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:24000.0,ersteRate:2000.0,intern:false,setter:"Emil",scgVol:2400.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:2400.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Kada",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:71.43,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:17000.0,ersteRate:17000.0,intern:false,setter:"Christian",scgVol:1700.0,scgCash:1700.0,internVol:0.0,internCash:0.0,externVol:1700.0,externCash:1700.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Lilli",scgVol:470.59,scgCash:193.28,internVol:0.0,internCash:0.0,externVol:470.59,externCash:193.28,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:8000.0,ersteRate:2000.0,intern:false,setter:"Emil",scgVol:800.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:800.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Yves",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:20.5,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Temmer",total:67500.0,ersteRate:33500.0,intern:false,setter:"Sülei",scgVol:6412.5,scgCash:3182.5,internVol:0.0,internCash:0.0,externVol:6412.5,externCash:3182.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2000.0,intern:true,setter:"Lukas",scgVol:840.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:840.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Yves",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:226.89,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lukas",scgVol:214.29,scgCash:214.29,internVol:0.0,internCash:0.0,externVol:214.29,externCash:214.29,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Yves",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:71.43,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Yves",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:71.43,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5480.0,ersteRate:2000.0,intern:true,setter:"Lukas",scgVol:822.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:822.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2000.0,intern:true,setter:"Lukas",scgVol:840.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:840.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:11280.0,ersteRate:11280.0,intern:true,setter:"Rene",scgVol:2256.0,scgCash:2256.0,internVol:2256.0,internCash:2256.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:846.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:941.18,scgCash:386.55,internVol:941.18,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:96.64,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lilli",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Michaela S",scgVol:142.86,scgCash:47.65,internVol:0.0,internCash:0.0,externVol:142.86,externCash:47.65,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:453.78,internVol:0.0,internCash:0.0,externVol:453.78,externCash:453.78,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4863.87,ersteRate:840.34,intern:true,setter:"Kada",scgVol:972.77,scgCash:168.07,internVol:972.77,internCash:168.07,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:42.02,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.19,intern:true,setter:"Michaela S",scgVol:142.86,scgCash:47.62,internVol:0.0,internCash:0.0,externVol:142.86,externCash:47.62,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Yves",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:226.89,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Yves",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:226.89,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Yves",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:71.43,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Kada",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:71.43,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Kada",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.19,intern:true,setter:"Kada",scgVol:285.71,scgCash:95.24,internVol:285.71,internCash:95.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:23.81,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Rene",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:71.43},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Rene",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:71.43},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:2317.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:92.68,internVol:0.0,internCash:0.0,externVol:556.0,externCash:92.68,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4789.92,ersteRate:1260.5,intern:true,setter:"Lukas",scgVol:718.49,scgCash:189.08,internVol:0.0,internCash:0.0,externVol:718.49,externCash:189.08,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lukas",scgVol:214.29,scgCash:71.47,internVol:0.0,internCash:0.0,externVol:214.29,externCash:71.47,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:3132.64,ersteRate:3132.64,intern:true,setter:"Sören",scgVol:626.53,scgCash:626.53,internVol:626.53,internCash:626.53,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:234.95,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Kada",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:20.5,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Lilli",scgVol:453.78,scgCash:453.78,internVol:0.0,internCash:0.0,externVol:453.78,externCash:453.78,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Yves",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:226.89,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lukas",scgVol:680.67,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:680.67,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Yves",scgVol:285.71,scgCash:95.29,internVol:285.71,internCash:95.29,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:23.82,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Yves",scgVol:285.71,scgCash:95.29,internVol:285.71,internCash:95.29,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:23.82,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Rene",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:20.5},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Lukas",scgVol:705.88,scgCash:252.1,internVol:0.0,internCash:0.0,externVol:705.88,externCash:252.1,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:226.89,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:888.0,ersteRate:888.0,intern:true,setter:"Rene",scgVol:177.6,scgCash:177.6,internVol:177.6,internCash:177.6,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:44.4},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Yves",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:84.03,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Rene",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:71.43},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Taim",scgVol:705.88,scgCash:252.1,internVol:0.0,internCash:0.0,externVol:705.88,externCash:252.1,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:2521.01,ersteRate:1260.5,intern:true,setter:"Rene",scgVol:504.2,scgCash:252.1,internVol:504.2,internCash:252.1,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:63.03},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:840.34,ersteRate:840.34,intern:true,setter:"Kada",scgVol:168.07,scgCash:168.07,internVol:168.07,internCash:168.07,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:42.02,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:6000.0,ersteRate:6000.0,intern:true,setter:"Rene",scgVol:1200.0,scgCash:1200.0,internVol:1200.0,internCash:1200.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:450.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:340.34},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Rene",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:107.14},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Taim",scgVol:680.67,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:680.67,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:170.17},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:1700.0,intern:true,setter:"Michaela S",scgVol:170.0,scgCash:170.0,internVol:0.0,internCash:0.0,externVol:170.0,externCash:170.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lukas",scgVol:680.67,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:680.67,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Taim",scgVol:705.88,scgCash:252.1,internVol:0.0,internCash:0.0,externVol:705.88,externCash:252.1,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Marvin",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:15000.0,ersteRate:15000.0,intern:true,setter:"Montano",scgVol:2100.0,scgCash:2100.0,internVol:2100.0,internCash:2100.0,externVol:0.0,externCash:0.0,montano:750.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:14970.0,ersteRate:14970.0,intern:true,setter:"Rene",scgVol:2994.0,scgCash:2994.0,internVol:2994.0,internCash:2994.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:1122.75},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Yves",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:84.03,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:57900.0,ersteRate:0.0,intern:true,setter:"Jochen",scgVol:5790.0,scgCash:0.0,internVol:0.0,internCash:0.0,externVol:5790.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:5000.0,ersteRate:5000.0,intern:true,setter:"Jochen",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:6218.49,ersteRate:6218.49,intern:true,setter:"Rene",scgVol:1243.7,scgCash:1243.7,internVol:1243.7,internCash:1243.7,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:466.39},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:1874.5,intern:false,setter:"Safo",scgVol:337.41,scgCash:168.71,internVol:0.0,internCash:0.0,externVol:337.41,externCash:168.71,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Rene",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:30.76},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lilli",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Yves",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:71.43,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:941.18,scgCash:386.55,internVol:941.18,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:96.64,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Schippke",total:20000.0,ersteRate:10000.0,intern:true,setter:"Cem",scgVol:5000.0,scgCash:2500.0,internVol:5000.0,internCash:2500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:800.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:11000.0,ersteRate:11000.0,intern:true,setter:"Montano",scgVol:1540.0,scgCash:1540.0,internVol:1540.0,internCash:1540.0,externVol:0.0,externCash:0.0,montano:550.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:8000.0,ersteRate:1333.0,intern:false,setter:"Tommy",scgVol:800.0,scgCash:133.3,internVol:0.0,internCash:0.0,externVol:800.0,externCash:133.3,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:840.34,intern:true,setter:"Yves",scgVol:907.56,scgCash:168.07,internVol:907.56,internCash:168.07,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:42.02,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lilli",scgVol:142.86,scgCash:47.65,internVol:0.0,internCash:0.0,externVol:142.86,externCash:47.65,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:746.22,ersteRate:186.55,intern:true,setter:"Lilli",scgVol:74.62,scgCash:18.66,internVol:0.0,internCash:0.0,externVol:74.62,externCash:18.66,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"Temmer",total:35000.0,ersteRate:2916.0,intern:false,setter:"Sülei",scgVol:3325.0,scgCash:277.02,internVol:0.0,internCash:0.0,externVol:3325.0,externCash:277.02,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:340.34},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Schippke",total:14500.0,ersteRate:2000.0,intern:true,setter:"Vanessa",scgVol:1450.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:1450.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Marvin",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:17500.0,ersteRate:5000.0,intern:true,setter:"Montano",scgVol:2450.0,scgCash:700.0,internVol:2450.0,internCash:700.0,externVol:0.0,externCash:0.0,montano:250.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:666.67,intern:false,setter:"Sülei",scgVol:360.0,scgCash:60.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:60.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:5400.0,ersteRate:5400.0,intern:true,setter:"Rene",scgVol:1080.0,scgCash:1080.0,internVol:1080.0,internCash:1080.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:405.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:6000.0,ersteRate:1000.0,intern:true,setter:"Sören",scgVol:1200.0,scgCash:200.0,internVol:1200.0,internCash:200.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:75.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:36000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:3600.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:5400.0,intern:true,setter:"Lilli",scgVol:540.0,scgCash:540.0,internVol:0.0,internCash:0.0,externVol:540.0,externCash:540.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"White Immobilien",total:30000.0,ersteRate:30000.0,intern:true,setter:"Mert",scgVol:30000.0,scgCash:30000.0,internVol:30000.0,internCash:30000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:14200.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:16400.0,ersteRate:4100.0,intern:false,setter:"Emil",scgVol:1640.0,scgCash:410.0,internVol:0.0,internCash:0.0,externVol:1640.0,externCash:410.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3997.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.73,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.73,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:5966.39,ersteRate:2506.88,intern:true,setter:"Kada",scgVol:1193.28,scgCash:501.38,internVol:1193.28,internCash:501.38,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:125.34,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Safo",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:36000.0,ersteRate:36000.0,intern:false,setter:"Emil",scgVol:3600.0,scgCash:3600.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:3600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:33000.0,ersteRate:5000.0,intern:false,setter:"Christian",scgVol:3300.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:3300.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Schippke",total:14500.0,ersteRate:7250.0,intern:true,setter:"Vanessa",scgVol:1450.0,scgCash:725.0,internVol:0.0,internCash:0.0,externVol:1450.0,externCash:725.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Sülei",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:5900.0,ersteRate:5900.0,intern:true,setter:"Tobias",scgVol:531.0,scgCash:531.0,internVol:0.0,internCash:0.0,externVol:531.0,externCash:531.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:8250.0,ersteRate:8250.0,intern:true,setter:"Jochen",scgVol:825.0,scgCash:825.0,internVol:0.0,internCash:0.0,externVol:825.0,externCash:825.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Safo",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Temmer",total:35000.0,ersteRate:11000.0,intern:false,setter:"Sülei",scgVol:3325.0,scgCash:1045.0,internVol:0.0,internCash:0.0,externVol:3325.0,externCash:1045.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Kada",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Tommy",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:16500.0,ersteRate:2750.0,intern:true,setter:"Montano",scgVol:2310.0,scgCash:385.0,internVol:2310.0,internCash:385.0,externVol:0.0,externCash:0.0,montano:137.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Sülei",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1680.67,ersteRate:1680.67,intern:true,setter:"Lilli",scgVol:168.07,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:168.07,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:4990.0,ersteRate:4900.0,intern:true,setter:"Sören",scgVol:998.0,scgCash:980.0,internVol:998.0,internCash:980.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:367.5,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3997.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.73,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.73,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Schippke",total:24000.0,ersteRate:5000.0,intern:true,setter:"Vanessa",scgVol:2400.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:2400.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:25900.0,ersteRate:25900.0,intern:true,setter:"Sascha",scgVol:1036.0,scgCash:1036.0,internVol:0.0,internCash:0.0,externVol:1036.0,externCash:1036.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:7950.0,ersteRate:2650.0,intern:true,setter:"Sören",scgVol:2186.25,scgCash:728.75,internVol:2186.25,internCash:728.75,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:198.75,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:9000.0,ersteRate:1500.0,intern:true,setter:"Arlind",scgVol:1800.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:3000.0,ersteRate:3000.0,intern:true,setter:"Arlind",scgVol:600.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:16400.0,ersteRate:16400.0,intern:false,setter:"Emil",scgVol:1640.0,scgCash:1640.0,internVol:0.0,internCash:0.0,externVol:1640.0,externCash:1640.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:270.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:270.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:18000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:1800.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Schippke",total:9500.0,ersteRate:4750.0,intern:true,setter:"Cem",scgVol:2375.0,scgCash:1187.5,internVol:2375.0,internCash:1187.5,externVol:0.0,externCash:0.0,montano:0.0,cem:380.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:4800.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:480.0,scgCash:40.0,internVol:0.0,internCash:0.0,externVol:480.0,externCash:40.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Kada",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Safo",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:226.89,internVol:0.0,internCash:0.0,externVol:453.78,externCash:226.89,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:567.0,intern:true,setter:"Rene",scgVol:340.0,scgCash:113.4,internVol:340.0,internCash:113.4,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:42.53},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Rene",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:30.76},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Lukas",scgVol:680.67,scgCash:680.67,internVol:0.0,internCash:0.0,externVol:680.67,externCash:680.67,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Michaela S",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Lukas",scgVol:214.29,scgCash:214.29,internVol:0.0,internCash:0.0,externVol:214.29,externCash:214.29,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Yves",scgVol:285.71,scgCash:95.29,internVol:285.71,internCash:95.29,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:23.82,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Lilli",scgVol:453.78,scgCash:453.78,internVol:0.0,internCash:0.0,externVol:453.78,externCash:453.78,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Schippke",total:30000.0,ersteRate:30000.0,intern:true,setter:"Vanessa",scgVol:3000.0,scgCash:3000.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:3000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Rene",scgVol:900.0,scgCash:900.0,internVol:900.0,internCash:900.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:337.5},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Yves",scgVol:941.18,scgCash:336.13,internVol:941.18,internCash:336.13,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:84.03,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Schippke",total:14500.0,ersteRate:14500.0,intern:true,setter:"Vanessa",scgVol:1450.0,scgCash:1450.0,internVol:0.0,internCash:0.0,externVol:1450.0,externCash:1450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:5900.0,ersteRate:5900.0,intern:true,setter:"Tobias",scgVol:531.0,scgCash:531.0,internVol:0.0,internCash:0.0,externVol:531.0,externCash:531.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:15900.0,ersteRate:15900.0,intern:true,setter:"Marvin",scgVol:636.0,scgCash:636.0,internVol:0.0,internCash:0.0,externVol:636.0,externCash:636.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:9950.0,ersteRate:2650.0,intern:true,setter:"Sören",scgVol:2736.25,scgCash:728.75,internVol:2736.25,internCash:728.75,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:198.75,rene:0.0},
  {datum:"26.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:170.17},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Kada",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:20.5,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Schippke",total:17500.0,ersteRate:5000.0,intern:true,setter:"Vanessa",scgVol:1750.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:1750.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3900.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:351.0,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:351.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3900.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:351.0,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:351.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:6510.0,ersteRate:1085.0,intern:true,setter:"Sören",scgVol:1302.0,scgCash:217.0,internVol:1302.0,internCash:217.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:81.38,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:11061.68,ersteRate:11061.68,intern:true,setter:"Felix",scgVol:1106.17,scgCash:1106.17,internVol:0.0,internCash:0.0,externVol:1106.17,externCash:1106.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:2088.23,ersteRate:2088.23,intern:true,setter:"Felix",scgVol:208.82,scgCash:208.82,internVol:0.0,internCash:0.0,externVol:208.82,externCash:208.82,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:12500.0,ersteRate:6250.0,intern:true,setter:"Felix",scgVol:1250.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:1250.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Everflow Excellence",total:18000.0,ersteRate:18000.0,intern:false,setter:"Emil",scgVol:1800.0,scgCash:1800.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:1800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:11250.0,ersteRate:3750.0,intern:true,setter:"Sören",scgVol:3093.75,scgCash:1031.25,internVol:3093.75,internCash:1031.25,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:281.25,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:12000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:1200.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:10800.0,ersteRate:10800.0,intern:true,setter:"Sören",scgVol:2160.0,scgCash:2160.0,internVol:2160.0,internCash:2160.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:810.0,rene:0.0},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"Grundl Leadership",total:3231.68,ersteRate:3231.68,intern:true,setter:"Rene",scgVol:646.34,scgCash:646.34,internVol:646.34,internCash:646.34,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:242.38},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Rene",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:30.76},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:2100.84,ersteRate:2100.84,intern:true,setter:"Kada",scgVol:420.17,scgCash:420.17,internVol:420.17,internCash:420.17,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:105.04,soeren:0.0,rene:0.0},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:9900.0,ersteRate:5000.0,intern:true,setter:"Tobias",scgVol:891.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:891.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:3600.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:30.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:30.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:20000.0,ersteRate:3333.33,intern:true,setter:"Montano",scgVol:2800.0,scgCash:466.67,internVol:2800.0,internCash:466.67,externVol:0.0,externCash:0.0,montano:166.67,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.01.2026",monat:"Januar 2026",partner:"KHPH AG",total:25000.0,ersteRate:25000.0,intern:true,setter:"Petrit",scgVol:25000.0,scgCash:25000.0,internVol:25000.0,internCash:25000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:453.78,scgCash:453.78,internVol:0.0,internCash:0.0,externVol:453.78,externCash:453.78,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.01.2026",monat:"Januar 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Michaela S",scgVol:142.86,scgCash:142.86,internVol:0.0,internCash:0.0,externVol:142.86,externCash:142.86,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"Schippke",total:24000.0,ersteRate:24000.0,intern:true,setter:"Vanessa",scgVol:2400.0,scgCash:2400.0,internVol:0.0,internCash:0.0,externVol:2400.0,externCash:2400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:17500.0,ersteRate:3500.0,intern:true,setter:"Tobias",scgVol:1575.0,scgCash:315.0,internVol:0.0,internCash:0.0,externVol:1575.0,externCash:315.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:4725.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:425.25,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:425.25,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:6000.0,ersteRate:6000.0,intern:false,setter:"Christian",scgVol:600.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:20000.0,intern:false,setter:"Tommy",scgVol:2000.0,scgCash:2000.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:2000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Ben",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"ECOM HOUSE GmbH",total:18000.0,ersteRate:18000.0,intern:false,setter:"Sülei",scgVol:1800.0,scgCash:1800.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:1800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.01.2026",monat:"Januar 2026",partner:"Nuhi Consulting",total:2000.0,ersteRate:2000.0,intern:true,setter:"Arlind",scgVol:400.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Schippke",total:12500.0,ersteRate:12500.0,intern:true,setter:"Cem",scgVol:3125.0,scgCash:3125.0,internVol:3125.0,internCash:3125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1000.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Schippke",total:14500.0,ersteRate:14500.0,intern:true,setter:"Cem",scgVol:3625.0,scgCash:3625.0,internVol:3625.0,internCash:3625.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1160.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:14000.0,ersteRate:14000.0,intern:false,setter:"Tommy",scgVol:1400.0,scgCash:1400.0,internVol:0.0,internCash:0.0,externVol:1400.0,externCash:1400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3475.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:312.75,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:312.75,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Tommy",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Schippke",total:9500.0,ersteRate:3166.0,intern:true,setter:"Cem",scgVol:2375.0,scgCash:791.5,internVol:2375.0,internCash:791.5,externVol:0.0,externCash:0.0,montano:0.0,cem:253.28,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Schippke",total:11500.0,ersteRate:11500.0,intern:true,setter:"Cem",scgVol:2875.0,scgCash:2875.0,internVol:2875.0,internCash:2875.0,externVol:0.0,externCash:0.0,montano:0.0,cem:920.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:6950.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:278.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:278.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Kada",scgVol:984.2,scgCash:82.02,internVol:984.2,internCash:82.02,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:20.5,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3475.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:312.75,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:312.75,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:6000.0,ersteRate:6000.0,intern:true,setter:"Felix",scgVol:600.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Schippke",total:14500.0,ersteRate:7250.0,intern:true,setter:"Cem",scgVol:3625.0,scgCash:1812.5,internVol:3625.0,internCash:1812.5,externVol:0.0,externCash:0.0,montano:0.0,cem:580.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:5000.0,intern:false,setter:"Christian",scgVol:2000.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Temmer",total:37600.0,ersteRate:3133.33,intern:false,setter:"Sülei",scgVol:3572.0,scgCash:297.67,internVol:0.0,internCash:0.0,externVol:3572.0,externCash:297.67,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.02.2026",monat:"Februar 2026",partner:"Schippke",total:19500.0,ersteRate:19500.0,intern:true,setter:"Cem",scgVol:4875.0,scgCash:4875.0,internVol:4875.0,internCash:4875.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1560.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:21900.0,ersteRate:21900.0,intern:true,setter:"Marvin",scgVol:876.0,scgCash:876.0,internVol:0.0,internCash:0.0,externVol:876.0,externCash:876.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Ben",scgVol:1251.0,scgCash:1251.0,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:1251.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:4725.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:425.25,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:425.25,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:5400.0,ersteRate:5400.0,intern:true,setter:"Sören",scgVol:1080.0,scgCash:1080.0,internVol:1080.0,internCash:1080.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:405.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Sascha",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:44500.0,ersteRate:8290.0,intern:true,setter:"Montano",scgVol:6230.0,scgCash:1160.6,internVol:6230.0,internCash:1160.6,externVol:0.0,externCash:0.0,montano:414.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:80757.0,ersteRate:80757.0,intern:true,setter:"Felix",scgVol:8075.7,scgCash:8075.7,internVol:0.0,internCash:0.0,externVol:8075.7,externCash:8075.7,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Felix",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Sören",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:263.25,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:7950.0,ersteRate:2650.0,intern:true,setter:"Arlind",scgVol:1590.0,scgCash:530.0,internVol:0.0,internCash:0.0,externVol:1590.0,externCash:530.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:6120.0,ersteRate:6120.0,intern:true,setter:"Felix",scgVol:612.0,scgCash:612.0,internVol:0.0,internCash:0.0,externVol:612.0,externCash:612.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Schippke",total:11500.0,ersteRate:4000.0,intern:true,setter:"Cem",scgVol:2875.0,scgCash:1000.0,internVol:2875.0,internCash:1000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:320.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:1251.0,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:1251.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:15000.0,ersteRate:15000.0,intern:true,setter:"Montano",scgVol:2100.0,scgCash:2100.0,internVol:2100.0,internCash:2100.0,externVol:0.0,externCash:0.0,montano:750.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:27.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:27.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Schippke",total:9500.0,ersteRate:9500.0,intern:true,setter:"Cem",scgVol:2375.0,scgCash:2375.0,internVol:2375.0,internCash:2375.0,externVol:0.0,externCash:0.0,montano:0.0,cem:760.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:21000.0,ersteRate:10500.0,intern:true,setter:"Montano",scgVol:2940.0,scgCash:1470.0,internVol:2940.0,internCash:1470.0,externVol:0.0,externCash:0.0,montano:525.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Felix",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Rene",scgVol:900.0,scgCash:900.0,internVol:900.0,internCash:900.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:337.5},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:48000.0,ersteRate:4000.0,intern:true,setter:"Tobias",scgVol:4320.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:4320.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:24500.0,ersteRate:24500.0,intern:true,setter:"Marvin",scgVol:980.0,scgCash:980.0,internVol:0.0,internCash:0.0,externVol:980.0,externCash:980.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:299.0,ersteRate:299.0,intern:false,setter:"Tommy",scgVol:29.9,scgCash:29.9,internVol:0.0,internCash:0.0,externVol:29.9,externCash:29.9,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:9900.0,ersteRate:9900.0,intern:true,setter:"Sascha",scgVol:396.0,scgCash:396.0,internVol:0.0,internCash:0.0,externVol:396.0,externCash:396.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10500.0,ersteRate:10500.0,intern:false,setter:"Tommy",scgVol:1050.0,scgCash:1050.0,internVol:0.0,internCash:0.0,externVol:1050.0,externCash:1050.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:7500.0,ersteRate:2500.0,intern:true,setter:"Sören",scgVol:2062.5,scgCash:687.5,internVol:2062.5,internCash:687.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:187.5,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:42000.0,ersteRate:3500.0,intern:true,setter:"Montano",scgVol:5880.0,scgCash:490.0,internVol:5880.0,internCash:490.0,externVol:0.0,externCash:0.0,montano:175.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Felix",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Sören",scgVol:500.0,scgCash:500.0,internVol:500.0,internCash:500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:187.5,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:6990.0,ersteRate:2330.0,intern:true,setter:"Sören",scgVol:1922.25,scgCash:640.75,internVol:1922.25,internCash:640.75,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:174.75,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:83700.0,ersteRate:83700.0,intern:true,setter:"Felix",scgVol:8370.0,scgCash:8370.0,internVol:0.0,internCash:0.0,externVol:8370.0,externCash:8370.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3920.0,ersteRate:1316.34,intern:false,setter:"Sülei",scgVol:352.8,scgCash:118.47,internVol:0.0,internCash:0.0,externVol:352.8,externCash:118.47,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"MBA",total:5000.0,ersteRate:2500.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:312.5,internVol:0.0,internCash:0.0,externVol:625.0,externCash:312.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:36.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:36.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:1500.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:135.0,scgCash:27.0,internVol:0.0,internCash:0.0,externVol:135.0,externCash:27.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:5985.0,ersteRate:5985.0,intern:false,setter:"Tommy",scgVol:598.5,scgCash:598.5,internVol:0.0,internCash:0.0,externVol:598.5,externCash:598.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:9900.0,ersteRate:9900.0,intern:true,setter:"Sascha",scgVol:396.0,scgCash:396.0,internVol:0.0,internCash:0.0,externVol:396.0,externCash:396.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:2500.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:180.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:180.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:750.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:67.5,internVol:0.0,internCash:0.0,externVol:405.0,externCash:67.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Temmer",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2280.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:2280.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:270.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:270.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:1500.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:135.0,internVol:0.0,internCash:0.0,externVol:405.0,externCash:135.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1680.67,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:470.59,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:8250.0,ersteRate:2750.0,intern:true,setter:"Sören",scgVol:2268.75,scgCash:756.25,internVol:2268.75,internCash:756.25,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:206.25,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:15900.0,ersteRate:15900.0,intern:true,setter:"Marvin",scgVol:636.0,scgCash:636.0,internVol:0.0,internCash:0.0,externVol:636.0,externCash:636.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"MBA",total:10100.0,ersteRate:3541.58,intern:false,setter:"Sülei",scgVol:1262.5,scgCash:442.7,internVol:0.0,internCash:0.0,externVol:1262.5,externCash:442.7,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:36000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:3600.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Rene",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:263.25},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:12000.0,ersteRate:6000.0,intern:true,setter:"Felix",scgVol:1200.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:6950.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:625.5,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:625.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:1500.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:135.0,scgCash:27.0,internVol:0.0,internCash:0.0,externVol:135.0,externCash:27.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:7500.0,ersteRate:2500.0,intern:true,setter:"Sören",scgVol:2062.5,scgCash:687.5,internVol:2062.5,internCash:687.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:187.5,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:180.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:180.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:21000.0,ersteRate:3500.0,intern:false,setter:"Sülei",scgVol:2100.0,scgCash:350.0,internVol:0.0,internCash:0.0,externVol:2100.0,externCash:350.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:13531.86,ersteRate:13531.86,intern:true,setter:"Jochen",scgVol:1353.19,scgCash:1353.19,internVol:0.0,internCash:0.0,externVol:1353.19,externCash:1353.19,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:833.34,intern:false,setter:"Christian",scgVol:1000.0,scgCash:83.33,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:83.33,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:36000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:3600.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Temmer",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2280.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:2280.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.02.2026",monat:"Februar 2026",partner:"Temmer",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2280.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:2280.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Temmer",total:35000.0,ersteRate:11000.0,intern:false,setter:"Sülei",scgVol:3325.0,scgCash:1045.0,internVol:0.0,internCash:0.0,externVol:3325.0,externCash:1045.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Felix",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:500.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:50.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:50.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Schippke",total:12500.0,ersteRate:12500.0,intern:true,setter:"Cem",scgVol:3125.0,scgCash:3125.0,internVol:3125.0,internCash:3125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1000.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.02.2026",monat:"Februar 2026",partner:"Schippke",total:11500.0,ersteRate:5000.0,intern:true,setter:"Cem",scgVol:2875.0,scgCash:1250.0,internVol:2875.0,internCash:1250.0,externVol:0.0,externCash:0.0,montano:0.0,cem:400.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:23900.0,ersteRate:4780.0,intern:true,setter:"Tobias",scgVol:2151.0,scgCash:430.2,internVol:0.0,internCash:0.0,externVol:2151.0,externCash:430.2,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"Schippke",total:21000.0,ersteRate:21000.0,intern:true,setter:"Vanessa",scgVol:2100.0,scgCash:2100.0,internVol:0.0,internCash:0.0,externVol:2100.0,externCash:2100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"ZELLGUT GmbH",total:2006.72,ersteRate:167.23,intern:true,setter:"Dominique",scgVol:200.67,scgCash:16.72,internVol:0.0,internCash:0.0,externVol:200.67,externCash:16.72,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3475.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:312.75,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:312.75,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:28900.0,ersteRate:28900.0,intern:false,setter:"Tommy",scgVol:2890.0,scgCash:2890.0,internVol:0.0,internCash:0.0,externVol:2890.0,externCash:2890.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:9969.0,ersteRate:9969.0,intern:true,setter:"Sören",scgVol:1993.8,scgCash:1993.8,internVol:1993.8,internCash:1993.8,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:747.68,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:3000.0,ersteRate:3000.0,intern:true,setter:"Arlind",scgVol:600.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:5000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:450.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:500.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:50.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:50.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:16400.0,ersteRate:2000.0,intern:false,setter:"Emil",scgVol:1640.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:1640.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:6666.67,intern:false,setter:"Tommy",scgVol:2000.0,scgCash:666.67,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:666.67,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:35500.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:3550.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:3550.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:15000.0,ersteRate:2500.0,intern:true,setter:"Montano",scgVol:2100.0,scgCash:350.0,internVol:2100.0,internCash:350.0,externVol:0.0,externCash:0.0,montano:125.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:500.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:50.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:50.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:5000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Tommy",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:33000.0,ersteRate:7000.0,intern:true,setter:"Montano",scgVol:4620.0,scgCash:980.0,internVol:4620.0,internCash:980.0,externVol:0.0,externCash:0.0,montano:350.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Sören",scgVol:900.0,scgCash:900.0,internVol:900.0,internCash:900.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:337.5,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Rene",scgVol:900.0,scgCash:900.0,internVol:900.0,internCash:900.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:337.5},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:8000.0,ersteRate:8000.0,intern:false,setter:"Tommy",scgVol:800.0,scgCash:800.0,internVol:0.0,internCash:0.0,externVol:800.0,externCash:800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"KHPH AG",total:36000.0,ersteRate:3000.0,intern:true,setter:"Petrit",scgVol:36000.0,scgCash:3000.0,internVol:36000.0,internCash:3000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"KHPH AG",total:50000.0,ersteRate:25000.0,intern:true,setter:"Petrit",scgVol:50000.0,scgCash:25000.0,internVol:50000.0,internCash:25000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:567.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:567.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:5900.0,ersteRate:5900.0,intern:true,setter:"Tobias",scgVol:531.0,scgCash:531.0,internVol:0.0,internCash:0.0,externVol:531.0,externCash:531.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:4000.0,ersteRate:4000.0,intern:true,setter:"Felix",scgVol:400.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:500.0,ersteRate:500.0,intern:true,setter:"Felix",scgVol:50.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:50.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:490.0,ersteRate:490.0,intern:true,setter:"Felix",scgVol:49.0,scgCash:49.0,internVol:0.0,internCash:0.0,externVol:49.0,externCash:49.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:2000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:200.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:200.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:10800.0,ersteRate:10800.0,intern:true,setter:"Rene",scgVol:2160.0,scgCash:2160.0,internVol:2160.0,internCash:2160.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:810.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Michaela S",scgVol:470.59,scgCash:193.28,internVol:0.0,internCash:0.0,externVol:470.59,externCash:193.28,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:18000.0,ersteRate:8000.0,intern:true,setter:"Arlind",scgVol:3600.0,scgCash:1600.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:1600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:1251.0,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:1251.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:3200.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:320.0,scgCash:40.0,internVol:0.0,internCash:0.0,externVol:320.0,externCash:40.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:36.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:36.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.02.2026",monat:"Februar 2026",partner:"Temmer",total:37600.0,ersteRate:11000.0,intern:false,setter:"Sülei",scgVol:3572.0,scgCash:1045.0,internVol:0.0,internCash:0.0,externVol:3572.0,externCash:1045.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3850.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:346.5,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:346.5,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:2500.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:14000.0,ersteRate:14000.0,intern:false,setter:"Tommy",scgVol:1400.0,scgCash:1400.0,internVol:0.0,internCash:0.0,externVol:1400.0,externCash:1400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"ZELLGUT GmbH",total:840.34,ersteRate:840.34,intern:true,setter:"Kada",scgVol:147.06,scgCash:147.06,internVol:147.06,internCash:147.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:84.03,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:5000.0,ersteRate:5000.0,intern:true,setter:"Tobias",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:567.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:567.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Safo",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3500.0,ersteRate:1750.0,intern:false,setter:"Sülei",scgVol:315.0,scgCash:157.5,internVol:0.0,internCash:0.0,externVol:315.0,externCash:157.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.02.2026",monat:"Februar 2026",partner:"Temmer",total:10000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:950.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:950.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3850.0,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:346.5,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:346.5,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:8910.0,ersteRate:8910.0,intern:true,setter:"Felix",scgVol:891.0,scgCash:891.0,internVol:0.0,internCash:0.0,externVol:891.0,externCash:891.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:3900.0,ersteRate:3900.0,intern:true,setter:"Sören",scgVol:780.0,scgCash:780.0,internVol:780.0,internCash:780.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:292.5,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Sascha",scgVol:400.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:48000.0,ersteRate:4000.0,intern:false,setter:"Emil",scgVol:4800.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:4800.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:36000.0,ersteRate:18000.0,intern:false,setter:"Emil",scgVol:3600.0,scgCash:1800.0,internVol:0.0,internCash:0.0,externVol:3600.0,externCash:1800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Schippke",total:40000.0,ersteRate:40000.0,intern:true,setter:"Vanessa",scgVol:4000.0,scgCash:4000.0,internVol:0.0,internCash:0.0,externVol:4000.0,externCash:4000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3475.0,intern:true,setter:"Tobias",scgVol:1251.0,scgCash:312.75,internVol:0.0,internCash:0.0,externVol:1251.0,externCash:312.75,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:21000.0,ersteRate:1750.0,intern:true,setter:"Montano",scgVol:2940.0,scgCash:245.0,internVol:2940.0,internCash:245.0,externVol:0.0,externCash:0.0,montano:87.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Temmer",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2280.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:2280.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Tobias",scgVol:2016.0,scgCash:2016.0,internVol:0.0,internCash:0.0,externVol:2016.0,externCash:2016.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:1200.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:120.0,scgCash:30.0,internVol:0.0,internCash:0.0,externVol:120.0,externCash:30.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:4800.0,ersteRate:800.0,intern:false,setter:"Daniel Bidmon",scgVol:480.0,scgCash:80.0,internVol:0.0,internCash:0.0,externVol:480.0,externCash:80.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:193.28,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:1800.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:30.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:30.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:1000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:22400.0,ersteRate:3500.0,intern:true,setter:"Sascha",scgVol:896.0,scgCash:140.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:140.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:21000.0,ersteRate:21000.0,intern:true,setter:"Montano",scgVol:2940.0,scgCash:2940.0,internVol:2940.0,internCash:2940.0,externVol:0.0,externCash:0.0,montano:1050.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Schippke",total:40000.0,ersteRate:10000.0,intern:true,setter:"Cem",scgVol:10000.0,scgCash:2500.0,internVol:10000.0,internCash:2500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:800.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Temmer",total:10000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:950.0,scgCash:475.0,internVol:0.0,internCash:0.0,externVol:950.0,externCash:475.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:6410.0,ersteRate:6410.0,intern:false,setter:"Christian",scgVol:641.0,scgCash:641.0,internVol:0.0,internCash:0.0,externVol:641.0,externCash:641.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:54000.0,ersteRate:4500.0,intern:false,setter:"Emil",scgVol:5400.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:5400.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:54000.0,ersteRate:4500.0,intern:false,setter:"Emil",scgVol:5400.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:5400.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:12000.0,ersteRate:12000.0,intern:false,setter:"Emil",scgVol:1200.0,scgCash:1200.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:1200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:42000.0,ersteRate:3500.0,intern:true,setter:"Montano",scgVol:5880.0,scgCash:490.0,internVol:5880.0,internCash:490.0,externVol:0.0,externCash:0.0,montano:175.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Felix",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Felix",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:16500.0,ersteRate:2750.0,intern:true,setter:"Montano",scgVol:2310.0,scgCash:385.0,internVol:2310.0,internCash:385.0,externVol:0.0,externCash:0.0,montano:137.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:15000.0,ersteRate:2500.0,intern:true,setter:"Rene",scgVol:3000.0,scgCash:500.0,internVol:3000.0,internCash:500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:187.5},
  {datum:"25.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:12000.0,ersteRate:2000.0,intern:false,setter:"Emil",scgVol:1200.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Tommy",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:9100.0,ersteRate:9100.0,intern:false,setter:"Tommy",scgVol:910.0,scgCash:910.0,internVol:0.0,internCash:0.0,externVol:910.0,externCash:910.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Tommy",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Rene",scgVol:500.0,scgCash:500.0,internVol:500.0,internCash:500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:187.5},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:42000.0,ersteRate:7000.0,intern:true,setter:"Montano",scgVol:5880.0,scgCash:980.0,internVol:5880.0,internCash:980.0,externVol:0.0,externCash:0.0,montano:350.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:54000.0,ersteRate:0.0,intern:false,setter:"Emil",scgVol:5400.0,scgCash:0.0,internVol:0.0,internCash:0.0,externVol:5400.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3999.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.96,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.96,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:3150.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:126.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:126.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:226.89,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:5000.0,ersteRate:1666.67,intern:false,setter:"Sülei",scgVol:450.0,scgCash:150.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Grundl Leadership",total:7500.0,ersteRate:1250.0,intern:true,setter:"Sören",scgVol:1500.0,scgCash:250.0,internVol:1500.0,internCash:250.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:93.75,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"2b AHEAD ThinkTank GmbH",total:25000.0,ersteRate:6250.0,intern:false,setter:"Christian",scgVol:2500.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:2500.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Temmer",total:10000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:950.0,scgCash:475.0,internVol:0.0,internCash:0.0,externVol:950.0,externCash:475.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Candidate-flow",total:23900.0,ersteRate:23900.0,intern:true,setter:"Montano",scgVol:3346.0,scgCash:3346.0,internVol:3346.0,internCash:3346.0,externVol:0.0,externCash:0.0,montano:1195.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:300.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:300.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:333.33,intern:false,setter:"Sülei",scgVol:180.0,scgCash:30.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:30.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.02.2026",monat:"Februar 2026",partner:"Nuhi Consulting",total:7950.0,ersteRate:2650.0,intern:true,setter:"Arlind",scgVol:1590.0,scgCash:530.0,internVol:0.0,internCash:0.0,externVol:1590.0,externCash:530.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.02.2026",monat:"Februar 2026",partner:"Schippke",total:40000.0,ersteRate:15000.0,intern:true,setter:"Vanessa",scgVol:4000.0,scgCash:1500.0,internVol:0.0,internCash:0.0,externVol:4000.0,externCash:1500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.02.2026",monat:"Februar 2026",partner:"Schippke",total:9500.0,ersteRate:9500.0,intern:true,setter:"Vanessa",scgVol:950.0,scgCash:950.0,internVol:0.0,internCash:0.0,externVol:950.0,externCash:950.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.02.2026",monat:"Februar 2026",partner:"Everflow Excellence",total:50800.0,ersteRate:10000.0,intern:false,setter:"Emil",scgVol:5080.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:5080.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:400.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Marvin",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:3900.0,ersteRate:325.0,intern:true,setter:"Sören",scgVol:780.0,scgCash:65.0,internVol:780.0,internCash:65.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:24.38,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:4800.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:480.0,scgCash:40.0,internVol:0.0,internCash:0.0,externVol:480.0,externCash:40.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:52900.0,ersteRate:52900.0,intern:false,setter:"Tommy",scgVol:5290.0,scgCash:5290.0,internVol:0.0,internCash:0.0,externVol:5290.0,externCash:5290.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:25800.0,ersteRate:4300.0,intern:false,setter:"Tommy",scgVol:2580.0,scgCash:430.0,internVol:0.0,internCash:0.0,externVol:2580.0,externCash:430.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:6950.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:278.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:278.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Sascha",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Felix",scgVol:351.0,scgCash:351.0,internVol:0.0,internCash:0.0,externVol:351.0,externCash:351.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:2000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Schippke",total:5500.0,ersteRate:5500.0,intern:true,setter:"Vanessa",scgVol:550.0,scgCash:550.0,internVol:0.0,internCash:0.0,externVol:550.0,externCash:550.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Candidate-flow",total:21000.0,ersteRate:3500.0,intern:true,setter:"Montano",scgVol:2940.0,scgCash:490.0,internVol:2940.0,internCash:490.0,externVol:0.0,externCash:0.0,montano:175.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Candidate-flow",total:21000.0,ersteRate:3500.0,intern:true,setter:"Montano",scgVol:2940.0,scgCash:490.0,internVol:2940.0,internCash:490.0,externVol:0.0,externCash:0.0,montano:175.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Candidate-flow",total:42000.0,ersteRate:3500.0,intern:true,setter:"Montano",scgVol:5880.0,scgCash:490.0,internVol:5880.0,internCash:490.0,externVol:0.0,externCash:0.0,montano:175.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"Candidate-flow",total:23900.0,ersteRate:5000.0,intern:true,setter:"Tobias",scgVol:956.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:956.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.03.2026",monat:"März 2026",partner:"Schippke",total:14500.0,ersteRate:14500.0,intern:true,setter:"Vanessa",scgVol:1450.0,scgCash:1450.0,internVol:0.0,internCash:0.0,externVol:1450.0,externCash:1450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1680.67,ersteRate:1680.67,intern:true,setter:"Dominique",scgVol:168.07,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:168.07,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.03.2026",monat:"März 2026",partner:"Temmer",total:35000.0,ersteRate:11000.0,intern:false,setter:"Sülei",scgVol:3325.0,scgCash:1045.0,internVol:0.0,internCash:0.0,externVol:3325.0,externCash:1045.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3999.5,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.96,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.96,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:2490.0,ersteRate:2490.0,intern:true,setter:"Sören",scgVol:498.0,scgCash:498.0,internVol:498.0,internCash:498.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:186.75,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Candidate-flow",total:23900.0,ersteRate:11950.0,intern:true,setter:"Tobias",scgVol:956.0,scgCash:478.0,internVol:0.0,internCash:0.0,externVol:956.0,externCash:478.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3999.75,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.98,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.98,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:4900.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:196.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:196.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Safo",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Safo",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"05.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:12500.0,ersteRate:3125.0,intern:true,setter:"Rene",scgVol:2500.0,scgCash:625.0,internVol:2500.0,internCash:625.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:234.38},
  {datum:"06.03.2026",monat:"März 2026",partner:"Schippke",total:16500.0,ersteRate:10000.0,intern:true,setter:"Cem",scgVol:4125.0,scgCash:2500.0,internVol:4125.0,internCash:2500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:800.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"Nuhi Consulting",total:7950.0,ersteRate:2650.0,intern:true,setter:"Sören",scgVol:1987.5,scgCash:662.5,internVol:1987.5,internCash:662.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:198.75,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Safo",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"Temmer",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2280.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:2280.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:30000.0,ersteRate:15000.0,intern:false,setter:"Sülei",scgVol:3000.0,scgCash:1500.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:1500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"06.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:2490.72,ersteRate:207.52,intern:true,setter:"Rene",scgVol:498.14,scgCash:41.5,internVol:498.14,internCash:41.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:15.56},
  {datum:"06.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Volume-Trader",total:4154.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:12000.0,ersteRate:6000.0,intern:false,setter:"Sülei",scgVol:1200.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:2500.0,ersteRate:2500.0,intern:false,setter:"Sülei",scgVol:225.0,scgCash:225.0,internVol:0.0,internCash:0.0,externVol:225.0,externCash:225.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Sören",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:263.25,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"KHPH AG",total:25000.0,ersteRate:25000.0,intern:true,setter:"Henrik",scgVol:25000.0,scgCash:25000.0,internVol:25000.0,internCash:25000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Candidate-flow",total:7000.0,ersteRate:7000.0,intern:true,setter:"Tobias",scgVol:630.0,scgCash:630.0,internVol:0.0,internCash:0.0,externVol:630.0,externCash:630.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:453.78,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Kada",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:142.86,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"Temmer",total:37600.0,ersteRate:3133.33,intern:false,setter:"Sülei",scgVol:3572.0,scgCash:297.67,internVol:0.0,internCash:0.0,externVol:3572.0,externCash:297.67,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"Schippke",total:4500.0,ersteRate:4500.0,intern:true,setter:"Cem",scgVol:1125.0,scgCash:1125.0,internVol:1125.0,internCash:1125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:360.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3600.0,ersteRate:1200.0,intern:false,setter:"Sülei",scgVol:324.0,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:324.0,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:6400.0,ersteRate:1066.0,intern:true,setter:"Rene",scgVol:1280.0,scgCash:213.2,internVol:1280.0,internCash:213.2,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:53.3},
  {datum:"11.03.2026",monat:"März 2026",partner:"Schippke",total:30000.0,ersteRate:30000.0,intern:true,setter:"Cem",scgVol:7500.0,scgCash:7500.0,internVol:7500.0,internCash:7500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:2400.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:5000.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.03.2026",monat:"März 2026",partner:"Candidate-flow",total:12900.0,ersteRate:4000.0,intern:true,setter:"Montano",scgVol:1806.0,scgCash:560.0,internVol:1806.0,internCash:560.0,externVol:0.0,externCash:0.0,montano:200.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"11.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:5985.0,ersteRate:5985.0,intern:false,setter:"Christian",scgVol:598.5,scgCash:598.5,internVol:0.0,internCash:0.0,externVol:598.5,externCash:598.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Kada",scgVol:1120.0,scgCash:460.0,internVol:1120.0,internCash:460.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:230.0,soeren:0.0,rene:0.0},
  {datum:"12.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"12.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Rene",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:263.25},
  {datum:"13.03.2026",monat:"März 2026",partner:"Schippke",total:27000.0,ersteRate:17000.0,intern:true,setter:"Vanessa",scgVol:2700.0,scgCash:1700.0,internVol:0.0,internCash:0.0,externVol:2700.0,externCash:1700.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Rene",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:263.25},
  {datum:"13.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Safo",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:2006.72,ersteRate:167.23,intern:true,setter:"Dominique",scgVol:150.5,scgCash:12.54,internVol:0.0,internCash:0.0,externVol:150.5,externCash:12.54,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Candidate-flow",total:21000.0,ersteRate:3500.0,intern:true,setter:"Montano",scgVol:2940.0,scgCash:490.0,internVol:2940.0,internCash:490.0,externVol:0.0,externCash:0.0,montano:175.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Kada",scgVol:285.71,scgCash:285.71,internVol:285.71,internCash:285.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:142.86,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Felix",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Felix",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Felix",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:660.0,ersteRate:660.0,intern:true,setter:"Felix",scgVol:66.0,scgCash:66.0,internVol:0.0,internCash:0.0,externVol:66.0,externCash:66.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:8910.0,ersteRate:8910.0,intern:true,setter:"Rene",scgVol:1782.0,scgCash:1782.0,internVol:1782.0,internCash:1782.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:668.25},
  {datum:"13.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:2490.72,ersteRate:207.5,intern:true,setter:"Rene",scgVol:498.14,scgCash:41.5,internVol:498.14,internCash:41.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:15.56},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Lilli",scgVol:340.34,scgCash:170.17,internVol:0.0,internCash:0.0,externVol:340.34,externCash:170.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Lana",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Lilli",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:907.56,scgCash:907.56,internVol:907.56,internCash:907.56,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:340.34,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:8823.53,ersteRate:4411.76,intern:true,setter:"Kada",scgVol:1764.71,scgCash:882.35,internVol:1764.71,internCash:882.35,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:330.88,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:941.18,scgCash:386.55,internVol:941.18,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Lilli",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Elena",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4873.95,ersteRate:410.08,intern:true,setter:"Michaela S",scgVol:365.55,scgCash:30.76,internVol:0.0,internCash:0.0,externVol:365.55,externCash:30.76,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:941.18,scgCash:386.55,internVol:941.18,internCash:386.55,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Kada",scgVol:285.71,scgCash:95.29,internVol:285.71,internCash:95.29,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:35.74,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Rene",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:96.64},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Lilli",scgVol:107.14,scgCash:35.74,internVol:0.0,internCash:0.0,externVol:107.14,externCash:35.74,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"16.03.2026",monat:"März 2026",partner:"Candidate-flow",total:16500.0,ersteRate:2750.0,intern:true,setter:"Montano",scgVol:2310.0,scgCash:385.0,internVol:2310.0,internCash:385.0,externVol:0.0,externCash:0.0,montano:137.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Nuhi Consulting",total:6000.0,ersteRate:2000.0,intern:true,setter:"Arlind",scgVol:1200.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:907.56,scgCash:453.78,internVol:907.56,internCash:453.78,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1200.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:108.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:108.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:450.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:40.5,internVol:0.0,internCash:0.0,externVol:405.0,externCash:40.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Candidate-flow",total:25900.0,ersteRate:25900.0,intern:true,setter:"Marvin",scgVol:1036.0,scgCash:1036.0,internVol:0.0,internCash:0.0,externVol:1036.0,externCash:1036.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Nuhi Consulting",total:7125.0,ersteRate:7125.0,intern:true,setter:"Sören",scgVol:1781.25,scgCash:1781.25,internVol:1781.25,internCash:1781.25,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:534.38,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Miro",scgVol:1701.0,scgCash:1701.0,internVol:0.0,internCash:0.0,externVol:1701.0,externCash:1701.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:4500.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:405.0,internVol:0.0,internCash:0.0,externVol:405.0,externCash:405.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Elena",scgVol:340.34,scgCash:170.17,internVol:0.0,internCash:0.0,externVol:340.34,externCash:170.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Candidate-flow",total:3500.0,ersteRate:3500.0,intern:true,setter:"Marvin",scgVol:140.0,scgCash:140.0,internVol:0.0,internCash:0.0,externVol:140.0,externCash:140.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Temmer",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2280.0,scgCash:190.0,internVol:0.0,internCash:0.0,externVol:2280.0,externCash:190.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Elena",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Schippke",total:600.0,ersteRate:600.0,intern:true,setter:"Cem",scgVol:150.0,scgCash:150.0,internVol:150.0,internCash:150.0,externVol:0.0,externCash:0.0,montano:0.0,cem:48.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Christian",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Rene",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:96.64},
  {datum:"17.03.2026",monat:"März 2026",partner:"Temmer",total:10000.0,ersteRate:10000.0,intern:false,setter:"Sülei",scgVol:950.0,scgCash:950.0,internVol:0.0,internCash:0.0,externVol:950.0,externCash:950.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:794.12,scgCash:794.12,internVol:794.12,internCash:794.12,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:340.34,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Kada",scgVol:250.0,scgCash:250.0,internVol:250.0,internCash:250.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:107.14,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:5400.0,intern:true,setter:"Michaela S",scgVol:405.0,scgCash:405.0,internVol:0.0,internCash:0.0,externVol:405.0,externCash:405.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Schippke",total:14500.0,ersteRate:14500.0,intern:true,setter:"Cem",scgVol:3625.0,scgCash:3625.0,internVol:3625.0,internCash:3625.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1160.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Candidate-flow",total:14900.0,ersteRate:14900.0,intern:true,setter:"Marvin",scgVol:596.0,scgCash:596.0,internVol:0.0,internCash:0.0,externVol:596.0,externCash:596.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:41666.67,ersteRate:41667.67,intern:true,setter:"Felix",scgVol:4166.67,scgCash:4166.77,internVol:0.0,internCash:0.0,externVol:4166.67,externCash:4166.77,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:13500.0,ersteRate:7500.0,intern:true,setter:"Felix",scgVol:1350.0,scgCash:750.0,internVol:0.0,internCash:0.0,externVol:1350.0,externCash:750.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Kada",scgVol:250.0,scgCash:83.38,internVol:250.0,internCash:83.38,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:35.74,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4921.01,ersteRate:410.08,intern:true,setter:"Kada",scgVol:861.18,scgCash:71.76,internVol:861.18,internCash:71.76,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:30.76,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Elena",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Elena",scgVol:107.14,scgCash:107.14,internVol:0.0,internCash:0.0,externVol:107.14,externCash:107.14,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:5400.0,ersteRate:5400.0,intern:true,setter:"Sören",scgVol:1080.0,scgCash:1080.0,internVol:1080.0,internCash:1080.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:405.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:6000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4739.5,ersteRate:789.92,intern:true,setter:"Elena",scgVol:355.46,scgCash:59.24,internVol:0.0,internCash:0.0,externVol:355.46,externCash:59.24,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:794.12,scgCash:794.12,internVol:794.12,internCash:794.12,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:340.34,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:30000.0,ersteRate:30000.0,intern:false,setter:"Sülei",scgVol:3000.0,scgCash:3000.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:3000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:24000.0,ersteRate:24000.0,intern:false,setter:"Sülei",scgVol:2400.0,scgCash:2400.0,internVol:0.0,internCash:0.0,externVol:2400.0,externCash:2400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:2500.0,ersteRate:250.0,intern:false,setter:"Sülei",scgVol:225.0,scgCash:22.5,internVol:0.0,internCash:0.0,externVol:225.0,externCash:22.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:12000.0,ersteRate:12000.0,intern:true,setter:"Rene",scgVol:2400.0,scgCash:2400.0,internVol:2400.0,internCash:2400.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:900.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Elena",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:567.0,intern:true,setter:"Kada",scgVol:297.5,scgCash:99.23,internVol:297.5,internCash:99.23,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:42.53,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Elena",scgVol:107.14,scgCash:35.74,internVol:0.0,internCash:0.0,externVol:107.14,externCash:35.74,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"18.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:76560.0,ersteRate:12760.0,intern:true,setter:"Jochen",scgVol:7656.0,scgCash:1276.0,internVol:0.0,internCash:0.0,externVol:7656.0,externCash:1276.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Lilli",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Dominique",scgVol:340.34,scgCash:170.17,internVol:0.0,internCash:0.0,externVol:340.34,externCash:170.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Elena",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:714.29,intern:true,setter:"Kada",scgVol:250.0,scgCash:125.0,internVol:250.0,internCash:125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:53.57,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"Temmer",total:10000.0,ersteRate:3333.33,intern:false,setter:"Sülei",scgVol:950.0,scgCash:316.67,internVol:0.0,internCash:0.0,externVol:950.0,externCash:316.67,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"Nuhi Consulting",total:7950.0,ersteRate:2000.0,intern:true,setter:"Arlind",scgVol:1590.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:1590.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Elena",scgVol:107.14,scgCash:35.74,internVol:0.0,internCash:0.0,externVol:107.14,externCash:35.74,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"19.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Kada",scgVol:250.0,scgCash:83.38,internVol:250.0,internCash:83.38,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:35.74,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Lilli",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:19699.7,ersteRate:9341.64,intern:true,setter:"Jochen",scgVol:1969.97,scgCash:934.16,internVol:0.0,internCash:0.0,externVol:1969.97,externCash:934.16,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Candidate-flow",total:9900.0,ersteRate:9900.0,intern:true,setter:"Marvin",scgVol:396.0,scgCash:396.0,internVol:0.0,internCash:0.0,externVol:396.0,externCash:396.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:22900.0,ersteRate:2900.0,intern:false,setter:"Tommy",scgVol:2290.0,scgCash:290.0,internVol:0.0,internCash:0.0,externVol:2290.0,externCash:290.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Rene",scgVol:794.12,scgCash:794.12,internVol:794.12,internCash:794.12,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:226.89},
  {datum:"20.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:14015.0,ersteRate:14015.0,intern:false,setter:"Tommy",scgVol:1401.5,scgCash:1401.5,internVol:0.0,internCash:0.0,externVol:1401.5,externCash:1401.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3475.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:139.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:139.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Candidate-flow",total:72000.0,ersteRate:6000.0,intern:true,setter:"Montano",scgVol:10080.0,scgCash:840.0,internVol:10080.0,internCash:840.0,externVol:0.0,externCash:0.0,montano:300.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:2400.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:240.0,scgCash:40.0,internVol:0.0,internCash:0.0,externVol:240.0,externCash:40.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Temmer",total:7500.0,ersteRate:3750.0,intern:false,setter:"Sülei",scgVol:712.5,scgCash:356.25,internVol:0.0,internCash:0.0,externVol:712.5,externCash:356.25,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Sascha",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:20000.0,intern:false,setter:"Tommy",scgVol:2000.0,scgCash:2000.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:2000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:270.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:270.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"20.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Elena",scgVol:340.34,scgCash:170.17,internVol:0.0,internCash:0.0,externVol:340.34,externCash:170.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Elena",scgVol:107.14,scgCash:107.14,internVol:0.0,internCash:0.0,externVol:107.14,externCash:107.14,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:1428.57,intern:true,setter:"Michaela S",scgVol:107.14,scgCash:107.14,internVol:0.0,internCash:0.0,externVol:107.14,externCash:107.14,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Kada",scgVol:823.53,scgCash:338.24,internVol:823.53,internCash:338.24,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:144.96,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:714.29,intern:true,setter:"Kada",scgVol:250.0,scgCash:125.0,internVol:250.0,internCash:125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:53.57,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Lilli",scgVol:405.0,scgCash:202.5,internVol:0.0,internCash:0.0,externVol:405.0,externCash:202.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Kada",scgVol:980.0,scgCash:402.5,internVol:980.0,internCash:402.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:172.5,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Michaela S",scgVol:420.0,scgCash:172.5,internVol:0.0,internCash:0.0,externVol:420.0,externCash:172.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Kada",scgVol:945.0,scgCash:472.5,internVol:945.0,internCash:472.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:202.5,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"Candidate-flow",total:4500.0,ersteRate:4500.0,intern:true,setter:"Montano",scgVol:630.0,scgCash:630.0,internVol:630.0,internCash:630.0,externVol:0.0,externCash:0.0,montano:225.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:15000.0,ersteRate:15000.0,intern:false,setter:"Sülei",scgVol:1500.0,scgCash:1500.0,internVol:0.0,internCash:0.0,externVol:1500.0,externCash:1500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Michaela S",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Dominique",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Michaela S",scgVol:107.14,scgCash:35.74,internVol:0.0,internCash:0.0,externVol:107.14,externCash:35.74,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Lilli",scgVol:340.34,scgCash:340.34,internVol:0.0,internCash:0.0,externVol:340.34,externCash:340.34,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"Candidate-flow",total:14900.0,ersteRate:14900.0,intern:true,setter:"Marvin",scgVol:596.0,scgCash:596.0,internVol:0.0,internCash:0.0,externVol:596.0,externCash:596.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Elena",scgVol:340.34,scgCash:170.17,internVol:0.0,internCash:0.0,externVol:340.34,externCash:170.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Jochen",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Schippke",total:16500.0,ersteRate:16500.0,intern:true,setter:"Vanessa",scgVol:1650.0,scgCash:1650.0,internVol:0.0,internCash:0.0,externVol:1650.0,externCash:1650.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:2500.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Tommy",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Schippke",total:16500.0,ersteRate:16500.0,intern:true,setter:"Cem",scgVol:4125.0,scgCash:4125.0,internVol:4125.0,internCash:4125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1320.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Candidate-flow",total:9900.0,ersteRate:9900.0,intern:true,setter:"Sascha",scgVol:396.0,scgCash:396.0,internVol:0.0,internCash:0.0,externVol:396.0,externCash:396.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Candidate-flow",total:8000.0,ersteRate:8000.0,intern:true,setter:"Tobias",scgVol:320.0,scgCash:320.0,internVol:0.0,internCash:0.0,externVol:320.0,externCash:320.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:11100.0,ersteRate:308.0,intern:true,setter:"Rene",scgVol:2220.0,scgCash:61.6,internVol:2220.0,internCash:61.6,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:23.1},
  {datum:"24.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:1500.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:135.0,internVol:0.0,internCash:0.0,externVol:405.0,externCash:135.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Temmer",total:12000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:1140.0,scgCash:95.0,internVol:0.0,internCash:0.0,externVol:1140.0,externCash:95.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Schippke",total:15900.0,ersteRate:15900.0,intern:true,setter:"Cem",scgVol:3975.0,scgCash:3975.0,internVol:3975.0,internCash:3975.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1272.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:54000.0,ersteRate:4500.0,intern:false,setter:"Sülei",scgVol:5400.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:5400.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:750.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:67.5,internVol:0.0,internCash:0.0,externVol:405.0,externCash:67.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:714.29,intern:true,setter:"Kada",scgVol:250.0,scgCash:125.0,internVol:250.0,internCash:125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:53.57,soeren:0.0,rene:0.0},
  {datum:"24.03.2026",monat:"März 2026",partner:"Candidate-flow",total:33000.0,ersteRate:2750.0,intern:true,setter:"Montano",scgVol:4620.0,scgCash:385.0,internVol:4620.0,internCash:385.0,externVol:0.0,externCash:0.0,montano:137.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:4537.82,intern:true,setter:"Kada",scgVol:794.12,scgCash:794.12,internVol:794.12,internCash:794.12,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:340.34,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:5000.0,ersteRate:5000.0,intern:true,setter:"Felix",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Felix",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Felix",scgVol:450.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:10500.0,ersteRate:10500.0,intern:true,setter:"Felix",scgVol:1050.0,scgCash:1050.0,internVol:0.0,internCash:0.0,externVol:1050.0,externCash:1050.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:10800.0,ersteRate:10800.0,intern:true,setter:"Felix",scgVol:1080.0,scgCash:1080.0,internVol:0.0,internCash:0.0,externVol:1080.0,externCash:1080.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:8490.0,ersteRate:1415.0,intern:true,setter:"Rene",scgVol:1698.0,scgCash:283.0,internVol:1698.0,internCash:283.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:106.13},
  {datum:"25.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:5000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Yves",scgVol:945.0,scgCash:472.5,internVol:945.0,internCash:472.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:135.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:1700.0,intern:true,setter:"Kada",scgVol:297.5,scgCash:297.5,internVol:297.5,internCash:297.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:127.5,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"Candidate-flow",total:21900.0,ersteRate:10950.0,intern:true,setter:"Marvin",scgVol:876.0,scgCash:438.0,internVol:0.0,internCash:0.0,externVol:876.0,externCash:438.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"Schippke",total:14500.0,ersteRate:7250.0,intern:true,setter:"Cem",scgVol:3625.0,scgCash:1812.5,internVol:3625.0,internCash:1812.5,externVol:0.0,externCash:0.0,montano:0.0,cem:580.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:2500.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"CAREFREE",total:1524.0,ersteRate:1524.0,intern:false,setter:"Kenan",scgVol:152.4,scgCash:152.4,internVol:0.0,internCash:0.0,externVol:152.4,externCash:152.4,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:10000.0,ersteRate:10000.0,intern:false,setter:"Christian",scgVol:1000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:1000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"26.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:400.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Temmer",total:10000.0,ersteRate:10000.0,intern:false,setter:"Sülei",scgVol:950.0,scgCash:950.0,internVol:0.0,internCash:0.0,externVol:950.0,externCash:950.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:30175.41,ersteRate:30175.41,intern:true,setter:"Felix",scgVol:3017.54,scgCash:3017.54,internVol:0.0,internCash:0.0,externVol:3017.54,externCash:3017.54,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:18900.0,ersteRate:18900.0,intern:true,setter:"Felix",scgVol:1890.0,scgCash:1890.0,internVol:0.0,internCash:0.0,externVol:1890.0,externCash:1890.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:2916.0,ersteRate:2916.0,intern:true,setter:"Felix",scgVol:291.6,scgCash:291.6,internVol:0.0,internCash:0.0,externVol:291.6,externCash:291.6,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:15000.0,ersteRate:15000.0,intern:false,setter:"Sülei",scgVol:1500.0,scgCash:1500.0,internVol:0.0,internCash:0.0,externVol:1500.0,externCash:1500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Elena",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5966.39,ersteRate:1680.67,intern:true,setter:"Yves",scgVol:1044.12,scgCash:294.12,internVol:1044.12,internCash:294.12,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:84.03,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Candidate-flow",total:16500.0,ersteRate:2750.0,intern:true,setter:"Montano",scgVol:2310.0,scgCash:385.0,internVol:2310.0,internCash:385.0,externVol:0.0,externCash:0.0,montano:137.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:24000.0,ersteRate:2000.0,intern:false,setter:"Sülei",scgVol:2400.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:2400.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Kada",scgVol:980.0,scgCash:402.5,internVol:980.0,internCash:402.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:172.5,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Candidate-flow",total:16500.0,ersteRate:2750.0,intern:true,setter:"Montano",scgVol:2310.0,scgCash:385.0,internVol:2310.0,internCash:385.0,externVol:0.0,externCash:0.0,montano:137.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:7500.0,ersteRate:7500.0,intern:true,setter:"Felix",scgVol:750.0,scgCash:750.0,internVol:0.0,internCash:0.0,externVol:750.0,externCash:750.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Kada",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:170.17,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Elena",scgVol:340.34,scgCash:170.17,internVol:0.0,internCash:0.0,externVol:340.34,externCash:170.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"White Immobilien",total:19362.35,ersteRate:19362.35,intern:true,setter:"Mert",scgVol:19362.35,scgCash:19362.35,internVol:19362.35,internCash:19362.35,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:580.87,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.03.2026",monat:"März 2026",partner:"White Immobilien",total:40835.29,ersteRate:40835.29,intern:true,setter:"Mert",scgVol:40835.29,scgCash:40835.29,internVol:40835.29,internCash:40835.29,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:1225.06,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:2780.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:111.2,internVol:0.0,internCash:0.0,externVol:556.0,externCash:111.2,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"Candidate-flow",total:16500.0,ersteRate:16500.0,intern:true,setter:"Montano",scgVol:2310.0,scgCash:2310.0,internVol:2310.0,internCash:2310.0,externVol:0.0,externCash:0.0,montano:825.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4705.88,ersteRate:1932.77,intern:true,setter:"Elena",scgVol:352.94,scgCash:144.96,internVol:0.0,internCash:0.0,externVol:352.94,externCash:144.96,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"Candidate-flow",total:5900.0,ersteRate:5900.0,intern:true,setter:"Tobias",scgVol:531.0,scgCash:531.0,internVol:0.0,internCash:0.0,externVol:531.0,externCash:531.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:5000.0,intern:false,setter:"Christian",scgVol:2000.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Rene",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:113.45},
  {datum:"30.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Michaela S",scgVol:340.34,scgCash:170.17,internVol:0.0,internCash:0.0,externVol:340.34,externCash:170.17,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:1512.61,intern:true,setter:"Kada",scgVol:794.12,scgCash:264.71,internVol:794.12,internCash:264.71,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:113.45,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:746.22,ersteRate:186.55,intern:true,setter:"Yves",scgVol:130.59,scgCash:32.65,internVol:130.59,internCash:32.65,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:9.33,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:476.47,intern:true,setter:"Michaela S",scgVol:107.14,scgCash:35.74,internVol:0.0,internCash:0.0,externVol:107.14,externCash:35.74,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:8010.0,ersteRate:8010.0,intern:true,setter:"Rene",scgVol:1602.0,scgCash:1602.0,internVol:1602.0,internCash:1602.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:600.75},
  {datum:"31.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3475.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:139.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:139.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Candidate-flow",total:17400.0,ersteRate:17400.0,intern:true,setter:"Marvin",scgVol:696.0,scgCash:696.0,internVol:0.0,internCash:0.0,externVol:696.0,externCash:696.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Schippke",total:19500.0,ersteRate:19500.0,intern:true,setter:"Vanessa",scgVol:1950.0,scgCash:1950.0,internVol:0.0,internCash:0.0,externVol:1950.0,externCash:1950.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Schippke",total:14500.0,ersteRate:7250.0,intern:true,setter:"Vanessa",scgVol:1450.0,scgCash:725.0,internVol:0.0,internCash:0.0,externVol:1450.0,externCash:725.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Rene",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:263.25},
  {datum:"31.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:1428.57,ersteRate:714.29,intern:true,setter:"Yves",scgVol:250.0,scgCash:125.0,internVol:250.0,internCash:125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:35.71,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"ZELLGUT GmbH",total:4537.82,ersteRate:2268.91,intern:true,setter:"Yves",scgVol:794.12,scgCash:397.06,internVol:794.12,internCash:397.06,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:113.45,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:5000.0,intern:false,setter:"Christian",scgVol:2000.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Schippke",total:11500.0,ersteRate:5750.0,intern:true,setter:"Cem",scgVol:2875.0,scgCash:1437.5,internVol:2875.0,internCash:1437.5,externVol:0.0,externCash:0.0,montano:0.0,cem:460.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:1560.0,ersteRate:130.0,intern:false,setter:"Sülei",scgVol:156.0,scgCash:13.0,internVol:0.0,internCash:0.0,externVol:156.0,externCash:13.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Schippke",total:9500.0,ersteRate:4750.0,intern:true,setter:"Cem",scgVol:2375.0,scgCash:1187.5,internVol:2375.0,internCash:1187.5,externVol:0.0,externCash:0.0,montano:0.0,cem:380.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Grundl Leadership",total:20833.33,ersteRate:20833.33,intern:true,setter:"Felix",scgVol:2083.33,scgCash:2083.33,internVol:0.0,internCash:0.0,externVol:2083.33,externCash:2083.33,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Candidate-flow",total:9900.0,ersteRate:1980.0,intern:true,setter:"Sascha",scgVol:396.0,scgCash:79.2,internVol:0.0,internCash:0.0,externVol:396.0,externCash:79.2,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:54000.0,ersteRate:4500.0,intern:false,setter:"Sülei",scgVol:5400.0,scgCash:450.0,internVol:0.0,internCash:0.0,externVol:5400.0,externCash:450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"31.03.2026",monat:"März 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:2400.0,ersteRate:2400.0,intern:false,setter:"Sülei",scgVol:216.0,scgCash:216.0,internVol:0.0,internCash:0.0,externVol:216.0,externCash:216.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:5000.0,intern:true,setter:"Tobias",scgVol:400.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Kada",scgVol:945.0,scgCash:472.5,internVol:945.0,internCash:472.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:202.5,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:4725.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:189.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:189.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:1500.0,ersteRate:150.0,intern:false,setter:"Sülei",scgVol:135.0,scgCash:13.5,internVol:0.0,internCash:0.0,externVol:135.0,externCash:13.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:1700.0,intern:true,setter:"Kada",scgVol:297.5,scgCash:297.5,internVol:297.5,internCash:297.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:127.5,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Everflow Excellence",total:8000.0,ersteRate:8000.0,intern:false,setter:"Emil",scgVol:800.0,scgCash:800.0,internVol:0.0,internCash:0.0,externVol:800.0,externCash:800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Candidate-flow",total:21000.0,ersteRate:3500.0,intern:true,setter:"Tobias",scgVol:840.0,scgCash:140.0,internVol:0.0,internCash:0.0,externVol:840.0,externCash:140.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Candidate-flow",total:9990.0,ersteRate:4995.0,intern:true,setter:"Tobias",scgVol:399.6,scgCash:199.8,internVol:0.0,internCash:0.0,externVol:399.6,externCash:199.8,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Candidate-flow",total:3500.0,ersteRate:3500.0,intern:true,setter:"Marvin",scgVol:140.0,scgCash:140.0,internVol:0.0,internCash:0.0,externVol:140.0,externCash:140.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Tommy",scgVol:1200.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:5000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:700.0,internVol:1400.0,internCash:700.0,externVol:0.0,externCash:0.0,montano:250.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:4635.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:185.4,internVol:0.0,internCash:0.0,externVol:556.0,externCash:185.4,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:2640.0,ersteRate:2640.0,intern:true,setter:"Sören",scgVol:528.0,scgCash:528.0,internVol:528.0,internCash:528.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:198.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3850.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:346.5,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:346.5,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Nuhi Consulting",total:7200.0,ersteRate:2400.0,intern:true,setter:"Arlind",scgVol:1440.0,scgCash:480.0,internVol:0.0,internCash:0.0,externVol:1440.0,externCash:480.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:2500.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"02.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3997.5,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.78,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.78,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:349.7,scgCash:349.7,internVol:0.0,internCash:0.0,externVol:349.7,externCash:349.7,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Sülei",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"03.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3850.0,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:346.5,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:346.5,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Rene",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:263.25},
  {datum:"07.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Elena",scgVol:405.0,scgCash:202.5,internVol:0.0,internCash:0.0,externVol:405.0,externCash:202.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:850.0,intern:true,setter:"Elena",scgVol:127.5,scgCash:63.75,internVol:0.0,internCash:0.0,externVol:127.5,externCash:63.75,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:3475.0,intern:true,setter:"Marvin",scgVol:556.0,scgCash:139.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:139.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"2b AHEAD ThinkTank GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Tommy",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"Candidate-flow",total:12900.0,ersteRate:12900.0,intern:true,setter:"Sascha",scgVol:516.0,scgCash:516.0,internVol:0.0,internCash:0.0,externVol:516.0,externCash:516.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"Candidate-flow",total:12900.0,ersteRate:12900.0,intern:true,setter:"Sascha",scgVol:516.0,scgCash:516.0,internVol:0.0,internCash:0.0,externVol:516.0,externCash:516.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"07.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:850.0,intern:true,setter:"Rene",scgVol:297.5,scgCash:148.75,internVol:297.5,internCash:148.75,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:42.5},
  {datum:"08.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Kada",scgVol:980.0,scgCash:402.5,internVol:980.0,internCash:402.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:172.5,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5640.0,ersteRate:940.0,intern:true,setter:"Kada",scgVol:987.0,scgCash:164.5,internVol:987.0,internCash:164.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:70.5,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:567.0,intern:true,setter:"Kada",scgVol:297.5,scgCash:99.23,internVol:297.5,internCash:99.23,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:42.53,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"Nuhi Consulting",total:8550.0,ersteRate:3000.0,intern:true,setter:"Sören",scgVol:2137.5,scgCash:750.0,internVol:2137.5,internCash:750.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:225.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:1500.0,ersteRate:1500.0,intern:false,setter:"Sülei",scgVol:135.0,scgCash:135.0,internVol:0.0,internCash:0.0,externVol:135.0,externCash:135.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"Schippke",total:9500.0,ersteRate:9500.0,intern:true,setter:"Cem",scgVol:2375.0,scgCash:2375.0,internVol:2375.0,internCash:2375.0,externVol:0.0,externCash:0.0,montano:0.0,cem:760.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:50.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:50.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:36.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:36.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:150.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:13.5,internVol:0.0,internCash:0.0,externVol:270.0,externCash:13.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"08.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Kada",scgVol:945.0,scgCash:472.5,internVol:945.0,internCash:472.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:202.5,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"2b AHEAD ThinkTank GmbH",total:1680.67,ersteRate:1680.67,intern:false,setter:"Tommy",scgVol:168.07,scgCash:168.07,internVol:0.0,internCash:0.0,externVol:168.07,externCash:168.07,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3497.0,ersteRate:3497.0,intern:false,setter:"Safo",scgVol:314.73,scgCash:314.73,internVol:0.0,internCash:0.0,externVol:314.73,externCash:314.73,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5700.0,ersteRate:1500.0,intern:true,setter:"Lilli",scgVol:427.5,scgCash:112.5,internVol:0.0,internCash:0.0,externVol:427.5,externCash:112.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Sören",scgVol:500.0,scgCash:500.0,internVol:500.0,internCash:500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:187.5,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Candidate-flow",total:16500.0,ersteRate:5500.0,intern:true,setter:"Montano",scgVol:2310.0,scgCash:770.0,internVol:2310.0,internCash:770.0,externVol:0.0,externCash:0.0,montano:275.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Candidate-flow",total:5000.0,ersteRate:5000.0,intern:true,setter:"Sascha",scgVol:200.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:200.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Candidate-flow",total:5900.0,ersteRate:5900.0,intern:true,setter:"Montano",scgVol:826.0,scgCash:826.0,internVol:826.0,internCash:826.0,externVol:0.0,externCash:0.0,montano:295.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Candidate-flow",total:23900.0,ersteRate:23900.0,intern:true,setter:"Tobias",scgVol:956.0,scgCash:956.0,internVol:0.0,internCash:0.0,externVol:956.0,externCash:956.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3850.0,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:346.5,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:346.5,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Peak",total:10000.0,ersteRate:10000.0,intern:true,setter:"Petrit",scgVol:10000.0,scgCash:10000.0,internVol:10000.0,internCash:10000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:6000.0,ersteRate:6000.0,intern:true,setter:"Sören",scgVol:1200.0,scgCash:1200.0,internVol:1200.0,internCash:1200.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:450.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Candidate-flow",total:15000.0,ersteRate:15000.0,intern:true,setter:"Montano",scgVol:2100.0,scgCash:2100.0,internVol:2100.0,internCash:2100.0,externVol:0.0,externCash:0.0,montano:750.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:1700.0,ersteRate:1700.0,intern:true,setter:"Kada",scgVol:297.5,scgCash:297.5,internVol:297.5,internCash:297.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:127.5,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:90.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:90.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"09.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:666.67,intern:false,setter:"Sülei",scgVol:360.0,scgCash:60.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:60.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:8100.0,ersteRate:1350.0,intern:true,setter:"Sören",scgVol:1620.0,scgCash:270.0,internVol:1620.0,internCash:270.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:101.25,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:9000.0,ersteRate:4500.0,intern:true,setter:"Rene",scgVol:1800.0,scgCash:900.0,internVol:1800.0,internCash:900.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:337.5},
  {datum:"10.04.2026",monat:"April 2026",partner:"Schippke",total:5500.0,ersteRate:5500.0,intern:true,setter:"Vanessa",scgVol:550.0,scgCash:550.0,internVol:0.0,internCash:0.0,externVol:550.0,externCash:550.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:99900.0,ersteRate:99900.0,intern:true,setter:"Sören",scgVol:19980.0,scgCash:19980.0,internVol:19980.0,internCash:19980.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:7492.5,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:200.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:18.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:18.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:4500.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:405.0,internVol:0.0,internCash:0.0,externVol:405.0,externCash:405.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:30000.0,ersteRate:15000.0,intern:false,setter:"Sülei",scgVol:3000.0,scgCash:1500.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:1500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3999.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:359.91,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:359.91,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:12535.54,ersteRate:1044.63,intern:true,setter:"Felix",scgVol:1253.55,scgCash:104.46,internVol:0.0,internCash:0.0,externVol:1253.55,externCash:104.46,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:74664.0,ersteRate:74664.0,intern:true,setter:"Felix",scgVol:7466.4,scgCash:7466.4,internVol:0.0,internCash:0.0,externVol:7466.4,externCash:7466.4,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Felix",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"10.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Kada",scgVol:945.0,scgCash:472.5,internVol:945.0,internCash:472.5,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:202.5,soeren:0.0,rene:0.0},
  {datum:"13.04.2026",monat:"April 2026",partner:"Schippke",total:12500.0,ersteRate:12500.0,intern:true,setter:"Vanessa",scgVol:1250.0,scgCash:1250.0,internVol:0.0,internCash:0.0,externVol:1250.0,externCash:1250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.04.2026",monat:"April 2026",partner:"Schippke",total:14500.0,ersteRate:14500.0,intern:true,setter:"Vanessa",scgVol:1450.0,scgCash:1450.0,internVol:0.0,internCash:0.0,externVol:1450.0,externCash:1450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.04.2026",monat:"April 2026",partner:"Schippke",total:11500.0,ersteRate:11500.0,intern:true,setter:"Vanessa",scgVol:1150.0,scgCash:1150.0,internVol:0.0,internCash:0.0,externVol:1150.0,externCash:1150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:4725.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:189.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:189.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:2500.0,ersteRate:2500.0,intern:true,setter:"Rene",scgVol:500.0,scgCash:500.0,internVol:500.0,internCash:500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:187.5},
  {datum:"13.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:15000.0,ersteRate:2500.0,intern:false,setter:"Sülei",scgVol:1500.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:1500.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"13.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:24000.0,ersteRate:8000.0,intern:false,setter:"Sülei",scgVol:2400.0,scgCash:800.0,internVol:0.0,internCash:0.0,externVol:2400.0,externCash:800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:4725.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:189.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:189.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Candidate-flow",total:23900.0,ersteRate:10000.0,intern:true,setter:"Sascha",scgVol:956.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:956.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:3600.0,ersteRate:3600.0,intern:true,setter:"Rene",scgVol:720.0,scgCash:720.0,internVol:720.0,internCash:720.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:270.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Temmer",total:10000.0,ersteRate:10000.0,intern:false,setter:"Sülei",scgVol:950.0,scgCash:950.0,internVol:0.0,internCash:0.0,externVol:950.0,externCash:950.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:10950.0,ersteRate:10950.0,intern:true,setter:"Sören",scgVol:2190.0,scgCash:2190.0,internVol:2190.0,internCash:2190.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:821.25,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Schippke",total:16500.0,ersteRate:16500.0,intern:true,setter:"Cem",scgVol:4125.0,scgCash:4125.0,internVol:4125.0,internCash:4125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1320.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"14.04.2026",monat:"April 2026",partner:"Peak",total:10820.17,ersteRate:10820.17,intern:true,setter:"Petrit",scgVol:10820.17,scgCash:10820.17,internVol:10820.17,internCash:10820.17,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Schippke",total:17500.0,ersteRate:8750.0,intern:true,setter:"Vanessa",scgVol:1750.0,scgCash:875.0,internVol:0.0,internCash:0.0,externVol:1750.0,externCash:875.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Marvin",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Candidate-flow",total:50000.0,ersteRate:20000.0,intern:true,setter:"Montano",scgVol:7000.0,scgCash:2800.0,internVol:7000.0,internCash:2800.0,externVol:0.0,externCash:0.0,montano:1000.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:5000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:700.0,internVol:1400.0,internCash:700.0,externVol:0.0,externCash:0.0,montano:250.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Schippke",total:7500.0,ersteRate:7500.0,intern:true,setter:"Cem",scgVol:1875.0,scgCash:1875.0,internVol:1875.0,internCash:1875.0,externVol:0.0,externCash:0.0,montano:0.0,cem:600.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:3000.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:270.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:270.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Nuhi Consulting",total:7500.0,ersteRate:2500.0,intern:true,setter:"Sören",scgVol:1875.0,scgCash:625.0,internVol:1875.0,internCash:625.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:187.5,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Nuhi Consulting",total:7500.0,ersteRate:7500.0,intern:true,setter:"Sören",scgVol:1875.0,scgCash:1875.0,internVol:1875.0,internCash:1875.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:562.5,rene:0.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Rene",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:263.25},
  {datum:"15.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:2520.0,ersteRate:2520.0,intern:true,setter:"Rene",scgVol:504.0,scgCash:504.0,internVol:504.0,internCash:504.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:189.0},
  {datum:"15.04.2026",monat:"April 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:6666.67,intern:false,setter:"Florian Schimpf",scgVol:3000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Schippke",total:15500.0,ersteRate:15500.0,intern:true,setter:"Vanessa",scgVol:1550.0,scgCash:1550.0,internVol:0.0,internCash:0.0,externVol:1550.0,externCash:1550.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Schippke",total:19500.0,ersteRate:19500.0,intern:true,setter:"Vanessa",scgVol:1950.0,scgCash:1950.0,internVol:0.0,internCash:0.0,externVol:1950.0,externCash:1950.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:1500.0,ersteRate:1500.0,intern:false,setter:"Sülei",scgVol:135.0,scgCash:135.0,internVol:0.0,internCash:0.0,externVol:135.0,externCash:135.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:6010.0,ersteRate:6010.0,intern:true,setter:"Rene",scgVol:1202.0,scgCash:1202.0,internVol:1202.0,internCash:1202.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:450.75},
  {datum:"16.04.2026",monat:"April 2026",partner:"Candidate-flow",total:5900.0,ersteRate:5900.0,intern:true,setter:"Montano",scgVol:826.0,scgCash:826.0,internVol:826.0,internCash:826.0,externVol:0.0,externCash:0.0,montano:295.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Investmentpunk",total:9500.0,ersteRate:9500.0,intern:false,setter:"Sülei",scgVol:1187.5,scgCash:1187.5,internVol:0.0,internCash:0.0,externVol:1187.5,externCash:1187.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"16.04.2026",monat:"April 2026",partner:"Investmentpunk",total:20000.0,ersteRate:2000.0,intern:false,setter:"Yannis",scgVol:2000.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:8970.0,ersteRate:8970.0,intern:true,setter:"Rene",scgVol:1794.0,scgCash:1794.0,internVol:1794.0,internCash:1794.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:672.75},
  {datum:"17.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Schippke",total:1000.0,ersteRate:1000.0,intern:true,setter:"Cem",scgVol:250.0,scgCash:250.0,internVol:250.0,internCash:250.0,externVol:0.0,externCash:0.0,montano:0.0,cem:80.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Schippke",total:5500.0,ersteRate:5500.0,intern:true,setter:"Vanessa",scgVol:550.0,scgCash:550.0,internVol:0.0,internCash:0.0,externVol:550.0,externCash:550.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Elena",scgVol:420.0,scgCash:172.5,internVol:0.0,internCash:0.0,externVol:420.0,externCash:172.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:2700.0,intern:true,setter:"Michaela S",scgVol:405.0,scgCash:202.5,internVol:0.0,internCash:0.0,externVol:405.0,externCash:202.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Temmer",total:12000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:1140.0,scgCash:95.0,internVol:0.0,internCash:0.0,externVol:1140.0,externCash:95.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:4500.0,ersteRate:1500.0,intern:false,setter:"Sülei",scgVol:405.0,scgCash:135.0,internVol:0.0,internCash:0.0,externVol:405.0,externCash:135.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Investmentpunk",total:9500.0,ersteRate:9500.0,intern:false,setter:"Sülei",scgVol:1187.5,scgCash:1187.5,internVol:0.0,internCash:0.0,externVol:1187.5,externCash:1187.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"17.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:6010.0,ersteRate:6010.0,intern:true,setter:"Rene",scgVol:1202.0,scgCash:1202.0,internVol:1202.0,internCash:1202.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:450.75},
  {datum:"17.04.2026",monat:"April 2026",partner:"Hamann & Kollegen Immobilien GmbH",total:20529.41,ersteRate:20529.41,intern:true,setter:"Henrik",scgVol:20529.41,scgCash:20529.41,internVol:20529.41,internCash:20529.41,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Schippke",total:40000.0,ersteRate:40000.0,intern:true,setter:"Vanessa",scgVol:4000.0,scgCash:4000.0,internVol:0.0,internCash:0.0,externVol:4000.0,externCash:4000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:6000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5600.0,ersteRate:2300.0,intern:true,setter:"Kada",scgVol:1120.0,scgCash:460.0,internVol:1120.0,internCash:460.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:172.5,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Investmentpunk",total:24000.0,ersteRate:2000.0,intern:false,setter:"Petrit",scgVol:4800.0,scgCash:400.0,internVol:4800.0,internCash:400.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Schippke",total:11500.0,ersteRate:11500.0,intern:true,setter:"Cem",scgVol:2875.0,scgCash:2875.0,internVol:2875.0,internCash:2875.0,externVol:0.0,externCash:0.0,montano:0.0,cem:920.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Candidate-flow",total:22400.0,ersteRate:22400.0,intern:true,setter:"Marvin",scgVol:896.0,scgCash:896.0,internVol:0.0,internCash:0.0,externVol:896.0,externCash:896.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Investmentpunk",total:18000.0,ersteRate:1800.0,intern:false,setter:"Olga Shvets",scgVol:1800.0,scgCash:180.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:180.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Investmentpunk",total:7315.0,ersteRate:7315.0,intern:false,setter:"Olga Shvets",scgVol:731.5,scgCash:731.5,internVol:0.0,internCash:0.0,externVol:731.5,externCash:731.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"20.04.2026",monat:"April 2026",partner:"Investmentpunk",total:20000.0,ersteRate:2000.0,intern:false,setter:"Yannis",scgVol:2000.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Schippke",total:7500.0,ersteRate:7500.0,intern:true,setter:"Vanessa",scgVol:750.0,scgCash:750.0,internVol:0.0,internCash:0.0,externVol:750.0,externCash:750.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18400.0,ersteRate:18400.0,intern:true,setter:"Marvin",scgVol:736.0,scgCash:736.0,internVol:0.0,internCash:0.0,externVol:736.0,externCash:736.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:900.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:900.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:11281.98,ersteRate:11281.98,intern:true,setter:"Felix",scgVol:1128.2,scgCash:1128.2,internVol:0.0,internCash:0.0,externVol:1128.2,externCash:1128.2,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Felix",scgVol:351.0,scgCash:351.0,internVol:0.0,internCash:0.0,externVol:351.0,externCash:351.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:18000.0,ersteRate:18000.0,intern:false,setter:"Sülei",scgVol:1800.0,scgCash:1800.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:1800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Florian Schimpf",scgVol:1800.0,scgCash:150.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Nuhi Consulting",total:9000.0,ersteRate:3000.0,intern:true,setter:"Sören",scgVol:2250.0,scgCash:750.0,internVol:2250.0,internCash:750.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:225.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:3600.0,ersteRate:300.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:30.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:30.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"21.04.2026",monat:"April 2026",partner:"Investmentpunk",total:10000.0,ersteRate:5000.0,intern:false,setter:"Adrian.B",scgVol:1250.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:1250.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Schippke",total:24000.0,ersteRate:24000.0,intern:true,setter:"Cem",scgVol:6000.0,scgCash:6000.0,internVol:6000.0,internCash:6000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1920.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Schippke",total:16500.0,ersteRate:16500.0,intern:true,setter:"Vanessa",scgVol:1650.0,scgCash:1650.0,internVol:0.0,internCash:0.0,externVol:1650.0,externCash:1650.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Schippke",total:14500.0,ersteRate:7250.0,intern:true,setter:"Cem",scgVol:3625.0,scgCash:1812.5,internVol:3625.0,internCash:1812.5,externVol:0.0,externCash:0.0,montano:0.0,cem:580.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Tobias",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Investmentpunk",total:10000.0,ersteRate:2500.0,intern:false,setter:"Sülei",scgVol:1250.0,scgCash:312.5,internVol:0.0,internCash:0.0,externVol:1250.0,externCash:312.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Candidate-flow",total:25900.0,ersteRate:25900.0,intern:true,setter:"Marvin",scgVol:1036.0,scgCash:1036.0,internVol:0.0,internCash:0.0,externVol:1036.0,externCash:1036.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:4800.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:480.0,scgCash:40.0,internVol:0.0,internCash:0.0,externVol:480.0,externCash:40.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:5000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:450.0,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:450.0,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3920.0,ersteRate:1316.34,intern:false,setter:"Sülei",scgVol:352.8,scgCash:118.47,internVol:0.0,internCash:0.0,externVol:352.8,externCash:118.47,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Investmentpunk",total:2500.0,ersteRate:2500.0,intern:false,setter:"Olga Shvets",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Investmentpunk",total:2500.0,ersteRate:2500.0,intern:false,setter:"Olga Shvets",scgVol:250.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:250.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Schippke",total:30000.0,ersteRate:30000.0,intern:true,setter:"Cem",scgVol:7500.0,scgCash:7500.0,internVol:7500.0,internCash:7500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:2400.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"22.04.2026",monat:"April 2026",partner:"Schippke",total:4500.0,ersteRate:4500.0,intern:true,setter:"Cem",scgVol:1125.0,scgCash:1125.0,internVol:1125.0,internCash:1125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:360.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:3510.0,ersteRate:3510.0,intern:true,setter:"Rene",scgVol:702.0,scgCash:702.0,internVol:702.0,internCash:702.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:263.25},
  {datum:"23.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Close Consulting - Leon",total:7500.0,ersteRate:2500.0,intern:false,setter:"Leon",scgVol:1500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:1500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:4633.33,intern:true,setter:"Marvin",scgVol:556.0,scgCash:185.33,internVol:0.0,internCash:0.0,externVol:556.0,externCash:185.33,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:14400.0,ersteRate:14400.0,intern:true,setter:"Sören",scgVol:2880.0,scgCash:2880.0,internVol:2880.0,internCash:2880.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:1080.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:2500.0,intern:false,setter:"Yannis",scgVol:500.0,scgCash:250.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:250.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Schippke",total:10000.0,ersteRate:5000.0,intern:true,setter:"Cem",scgVol:2500.0,scgCash:1250.0,internVol:2500.0,internCash:1250.0,externVol:0.0,externCash:0.0,montano:0.0,cem:400.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"23.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:6950.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:278.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:278.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Candidate-flow",total:20000.0,ersteRate:20000.0,intern:true,setter:"Montano",scgVol:2800.0,scgCash:2800.0,internVol:2800.0,internCash:2800.0,externVol:0.0,externCash:0.0,montano:1000.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:12000.0,ersteRate:12000.0,intern:true,setter:"Sören",scgVol:2400.0,scgCash:2400.0,internVol:2400.0,internCash:2400.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:900.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:4500.0,ersteRate:4500.0,intern:true,setter:"Sören",scgVol:450.0,scgCash:900.0,internVol:900.0,internCash:900.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:337.5,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:888.0,ersteRate:888.0,intern:true,setter:"Lilli",scgVol:66.6,scgCash:66.6,internVol:0.0,internCash:0.0,externVol:66.6,externCash:66.6,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"ZELLGUT GmbH",total:5400.0,ersteRate:5400.0,intern:true,setter:"Kada",scgVol:1080.0,scgCash:1080.0,internVol:1080.0,internCash:1080.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:405.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:2500.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:312.5,internVol:0.0,internCash:0.0,externVol:625.0,externCash:312.5,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Yannis",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Investmentpunk",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:1170.0,scgCash:900.0,internVol:0.0,internCash:0.0,externVol:1170.0,externCash:900.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Close Consulting - Leon",total:6000.0,ersteRate:2000.0,intern:false,setter:"Leon",scgVol:1200.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nadine Eversheim",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Investmentpunk",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:125.0,scgCash:125.0,internVol:0.0,internCash:0.0,externVol:125.0,externCash:125.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Adrian.B",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"24.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:3000.0,ersteRate:500.0,intern:false,setter:"Sülei",scgVol:270.0,scgCash:45.0,internVol:0.0,internCash:0.0,externVol:270.0,externCash:45.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Schippke",total:14500.0,ersteRate:14500.0,intern:true,setter:"Vanessa",scgVol:1450.0,scgCash:1450.0,internVol:0.0,internCash:0.0,externVol:1450.0,externCash:1450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Schippke",total:30000.0,ersteRate:30000.0,intern:true,setter:"Vanessa",scgVol:3000.0,scgCash:3000.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:3000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Schippke",total:14500.0,ersteRate:4833.0,intern:true,setter:"Cem",scgVol:3625.0,scgCash:1208.25,internVol:3625.0,internCash:1208.25,externVol:0.0,externCash:0.0,montano:0.0,cem:386.64,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Schippke",total:40000.0,ersteRate:40000.0,intern:true,setter:"Vanessa",scgVol:4000.0,scgCash:4000.0,internVol:0.0,internCash:0.0,externVol:4000.0,externCash:4000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Investmentpunk",total:20000.0,ersteRate:2000.0,intern:false,setter:"Yannis",scgVol:2000.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:2000.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Adrian.B",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Investmentpunk",total:4415.0,ersteRate:4415.0,intern:false,setter:"Adrian.B",scgVol:551.88,scgCash:551.88,internVol:0.0,internCash:0.0,externVol:551.88,externCash:551.88,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"25.04.2026",monat:"April 2026",partner:"Everflow Excellence",total:48000.0,ersteRate:4000.0,intern:false,setter:"Emil",scgVol:4800.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:4800.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Schippke",total:11500.0,ersteRate:5750.0,intern:true,setter:"Cem",scgVol:2875.0,scgCash:1437.5,internVol:2875.0,internCash:1437.5,externVol:0.0,externCash:0.0,montano:0.0,cem:460.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13000.0,ersteRate:13000.0,intern:true,setter:"Marvin",scgVol:520.0,scgCash:520.0,internVol:0.0,internCash:0.0,externVol:520.0,externCash:520.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Candidate-flow",total:15000.0,ersteRate:15000.0,intern:true,setter:"Montano",scgVol:2100.0,scgCash:2100.0,internVol:2100.0,internCash:2100.0,externVol:0.0,externCash:0.0,montano:750.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:10800.0,ersteRate:10800.0,intern:true,setter:"Felix",scgVol:1080.0,scgCash:1080.0,internVol:0.0,internCash:0.0,externVol:1080.0,externCash:1080.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:1197.0,ersteRate:399.0,intern:false,setter:"Sülei",scgVol:149.63,scgCash:49.88,internVol:0.0,internCash:0.0,externVol:149.63,externCash:49.88,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:6950.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:278.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:278.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:3000.0,ersteRate:3000.0,intern:false,setter:"Nico",scgVol:300.0,scgCash:300.0,internVol:0.0,internCash:0.0,externVol:300.0,externCash:300.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:1197.0,ersteRate:399.0,intern:false,setter:"Sülei",scgVol:149.63,scgCash:49.88,internVol:0.0,internCash:0.0,externVol:149.63,externCash:49.88,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Schippke",total:30000.0,ersteRate:30000.0,intern:true,setter:"Cem",scgVol:7500.0,scgCash:7500.0,internVol:7500.0,internCash:7500.0,externVol:0.0,externCash:0.0,montano:0.0,cem:2400.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Schippke",total:24500.0,ersteRate:24500.0,intern:true,setter:"Vanessa",scgVol:2450.0,scgCash:2450.0,internVol:0.0,internCash:0.0,externVol:2450.0,externCash:2450.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:11299.68,ersteRate:941.64,intern:true,setter:"Jochen",scgVol:1129.97,scgCash:94.16,internVol:0.0,internCash:0.0,externVol:1129.97,externCash:94.16,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:16667.0,ersteRate:16667.0,intern:true,setter:"Jochen",scgVol:1666.7,scgCash:1666.7,internVol:0.0,internCash:0.0,externVol:1666.7,externCash:1666.7,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:10620.0,ersteRate:10620.0,intern:true,setter:"Sören",scgVol:2124.0,scgCash:2124.0,internVol:2124.0,internCash:2124.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:796.5,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Adrian.B",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:16000.0,ersteRate:4000.0,intern:false,setter:"Yannis",scgVol:1600.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:1600.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:6300.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:252.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:252.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:4750.0,ersteRate:4750.0,intern:false,setter:"Yannis",scgVol:475.0,scgCash:475.0,internVol:0.0,internCash:0.0,externVol:475.0,externCash:475.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"27.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Adrian.B",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:4800.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:480.0,scgCash:40.0,internVol:0.0,internCash:0.0,externVol:480.0,externCash:40.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Schippke",total:40000.0,ersteRate:40000.0,intern:true,setter:"Cem",scgVol:10000.0,scgCash:10000.0,internVol:10000.0,internCash:10000.0,externVol:0.0,externCash:0.0,montano:0.0,cem:3200.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:5900.0,ersteRate:2850.0,intern:true,setter:"Montano",scgVol:826.0,scgCash:399.0,internVol:826.0,internCash:399.0,externVol:0.0,externCash:0.0,montano:142.5,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Montano",scgVol:1400.0,scgCash:1400.0,internVol:1400.0,internCash:1400.0,externVol:0.0,externCash:0.0,montano:500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Candidate-flow",total:23900.0,ersteRate:23900.0,intern:true,setter:"Sascha",scgVol:956.0,scgCash:956.0,internVol:0.0,internCash:0.0,externVol:956.0,externCash:956.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"28.04.2026",monat:"April 2026",partner:"Investmentpunk",total:4199.0,ersteRate:4199.0,intern:false,setter:"Yannis",scgVol:419.9,scgCash:419.9,internVol:0.0,internCash:0.0,externVol:419.9,externCash:419.9,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Candidate-flow",total:9000.0,ersteRate:3000.0,intern:true,setter:"Montano",scgVol:1260.0,scgCash:420.0,internVol:1260.0,internCash:420.0,externVol:0.0,externCash:0.0,montano:150.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Candidate-flow",total:10000.0,ersteRate:10000.0,intern:true,setter:"Tobias",scgVol:400.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:400.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Everflow Excellence",total:40000.0,ersteRate:10000.0,intern:false,setter:"Emil",scgVol:4000.0,scgCash:1000.0,internVol:0.0,internCash:0.0,externVol:4000.0,externCash:1000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Everflow Excellence",total:50000.0,ersteRate:20000.0,intern:false,setter:"Emil",scgVol:5000.0,scgCash:2000.0,internVol:0.0,internCash:0.0,externVol:5000.0,externCash:2000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"2b AHEAD ThinkTank GmbH",total:12000.0,ersteRate:1000.0,intern:false,setter:"Florian Schimpf",scgVol:1800.0,scgCash:150.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"2b AHEAD ThinkTank GmbH",total:20000.0,ersteRate:20000.0,intern:false,setter:"Florian Schimpf",scgVol:3000.0,scgCash:3000.0,internVol:0.0,internCash:0.0,externVol:3000.0,externCash:3000.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Investmentpunk",total:20000.0,ersteRate:5000.0,intern:false,setter:"Adrian.B",scgVol:2500.0,scgCash:625.0,internVol:0.0,internCash:0.0,externVol:2500.0,externCash:625.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:2780.0,intern:true,setter:"Sascha",scgVol:556.0,scgCash:111.2,internVol:0.0,internCash:0.0,externVol:556.0,externCash:111.2,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:1000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:100.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:100.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5500.0,ersteRate:5500.0,intern:false,setter:"Johann Schiefer",scgVol:550.0,scgCash:550.0,internVol:0.0,internCash:0.0,externVol:550.0,externCash:550.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"29.04.2026",monat:"April 2026",partner:"Investmentpunk",total:8000.0,ersteRate:4000.0,intern:false,setter:"Johann Schiefer",scgVol:800.0,scgCash:400.0,internVol:0.0,internCash:0.0,externVol:800.0,externCash:400.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Grundl Leadership",total:3900.0,ersteRate:325.0,intern:true,setter:"Sören",scgVol:780.0,scgCash:65.0,internVol:780.0,internCash:65.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:24.38,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:4800.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:480.0,scgCash:40.0,internVol:0.0,internCash:0.0,externVol:480.0,externCash:40.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Volume-Trader",total:4153.96,ersteRate:1000.0,intern:false,setter:"Safo",scgVol:373.86,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:373.86,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Close Consulting - Leon",total:6000.0,ersteRate:3000.0,intern:false,setter:"Leon",scgVol:1200.0,scgCash:600.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:600.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"ECOM HOUSE GmbH",total:6000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:600.0,scgCash:100.0,internVol:0.0,internCash:0.0,externVol:600.0,externCash:100.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Eitel Invest AG",total:4000.0,ersteRate:4000.0,intern:false,setter:"Sülei",scgVol:360.0,scgCash:360.0,internVol:0.0,internCash:0.0,externVol:360.0,externCash:360.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Volume-Trader",total:3750.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:337.5,scgCash:90.0,internVol:0.0,internCash:0.0,externVol:337.5,externCash:90.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"30.04.2026",monat:"April 2026",partner:"Candidate-flow",total:13900.0,ersteRate:13900.0,intern:true,setter:"Tobias",scgVol:556.0,scgCash:556.0,internVol:0.0,internCash:0.0,externVol:556.0,externCash:556.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"01.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:5000.0,ersteRate:5000.0,intern:false,setter:"Yannis",scgVol:500.0,scgCash:500.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:500.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Candidate-flow",total:21000.0,ersteRate:3500.0,intern:true,setter:"Montano",scgVol:2940.0,scgCash:490.0,internVol:2940.0,internCash:490.0,externVol:0.0,externCash:0.0,montano:175.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:5000.0,ersteRate:2000.0,intern:false,setter:"Nico",scgVol:500.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:12000.0,ersteRate:2000.0,intern:false,setter:"Yannis",scgVol:1200.0,scgCash:200.0,internVol:0.0,internCash:0.0,externVol:1200.0,externCash:200.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:19000.0,ersteRate:19000.0,intern:false,setter:"Sülei",scgVol:2375.0,scgCash:2375.0,internVol:0.0,internCash:0.0,externVol:2375.0,externCash:2375.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Schippke",total:11500.0,ersteRate:11500.0,intern:true,setter:"Vanessa",scgVol:1150.0,scgCash:1150.0,internVol:0.0,internCash:0.0,externVol:1150.0,externCash:1150.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Candidate-flow",total:1500.0,ersteRate:1500.0,intern:true,setter:"Tobias",scgVol:135.0,scgCash:135.0,internVol:0.0,internCash:0.0,externVol:135.0,externCash:135.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Candidate-flow",total:18900.0,ersteRate:18900.0,intern:true,setter:"Marvin",scgVol:756.0,scgCash:756.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:756.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Candidate-flow",total:23900.0,ersteRate:23900.0,intern:true,setter:"Marvin",scgVol:956.0,scgCash:956.0,internVol:0.0,internCash:0.0,externVol:956.0,externCash:956.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Eitel Invest AG",total:2000.0,ersteRate:400.0,intern:false,setter:"Sülei",scgVol:180.0,scgCash:36.0,internVol:0.0,internCash:0.0,externVol:180.0,externCash:36.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Volume-Trader",total:3749.0,ersteRate:3749.0,intern:false,setter:"Sülei",scgVol:337.41,scgCash:337.41,internVol:0.0,internCash:0.0,externVol:337.41,externCash:337.41,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:763.92,ersteRate:763.92,intern:false,setter:"Sülei",scgVol:95.49,scgCash:95.49,internVol:0.0,internCash:0.0,externVol:95.49,externCash:95.49,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:5000.0,ersteRate:1250.0,intern:false,setter:"Olga Shvets",scgVol:500.0,scgCash:125.0,internVol:0.0,internCash:0.0,externVol:500.0,externCash:125.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Candidate-flow",total:30000.0,ersteRate:30000.0,intern:true,setter:"Montano",scgVol:4200.0,scgCash:4200.0,internVol:4200.0,internCash:4200.0,externVol:0.0,externCash:0.0,montano:1500.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Candidate-flow",total:18900.0,ersteRate:9450.0,intern:true,setter:"Sascha",scgVol:756.0,scgCash:378.0,internVol:0.0,internCash:0.0,externVol:756.0,externCash:378.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Candidate-flow",total:5000.0,ersteRate:5000.0,intern:true,setter:"Montano",scgVol:700.0,scgCash:700.0,internVol:700.0,internCash:700.0,externVol:0.0,externCash:0.0,montano:250.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Schippke",total:16500.0,ersteRate:16500.0,intern:true,setter:"Cem",scgVol:4125.0,scgCash:4125.0,internVol:4125.0,internCash:4125.0,externVol:0.0,externCash:0.0,montano:0.0,cem:1320.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:8949.21,ersteRate:8949.21,intern:false,setter:"Yannis",scgVol:894.92,scgCash:894.92,internVol:0.0,internCash:0.0,externVol:894.92,externCash:894.92,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Hamann & Kollegen Immobilien GmbH",total:38340.0,ersteRate:38340.0,intern:true,setter:"Henrik",scgVol:38340.0,scgCash:38340.0,internVol:38340.0,internCash:38340.0,externVol:0.0,externCash:0.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Investmentpunk",total:5000.0,ersteRate:1000.0,intern:false,setter:"Sülei",scgVol:625.0,scgCash:125.0,internVol:0.0,internCash:0.0,externVol:625.0,externCash:125.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
  {datum:"04.05.2026",monat:"Mai 2026",partner:"Close Consulting - Leon",total:9000.0,ersteRate:9000.0,intern:false,setter:"Leon",scgVol:1800.0,scgCash:1800.0,internVol:0.0,internCash:0.0,externVol:1800.0,externCash:1800.0,montano:0.0,cem:0.0,yves:0.0,mert:0.0,kada:0.0,soeren:0.0,rene:0.0},
];

const DEALS_COUNT: Record<string,number> = {"April 2026":309, "Februar 2026":283, "Januar 2026":445, "Mai 2026":21, "März 2026":334};
const MONTHS = ["Januar 2026","Februar 2026","März 2026","April 2026","Mai 2026"];
const MONTH_SHORT: Record<string,string> = {"Januar 2026":"Jan","Februar 2026":"Feb","März 2026":"Mär","April 2026":"Apr","Mai 2026":"Mai"};
const fmt  = (n:number) => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const fmt0 = (n:number) => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

type PRow = {
  partner:string; total:number; ersteRate:number;
  internVol:number; internCash:number; externVol:number; externCash:number;
  scgVol:number; scgCash:number;
  montano:number; cem:number; yves:number; mert:number; kada:number; soeren:number; rene:number;
};
const nettoOf = (r:PRow) => r.scgCash - r.montano - r.cem - r.yves - r.mert - r.kada - r.soeren - r.rene;

function aggregate(deals:Deal[]):PRow[] {
  const map:Record<string,PRow> = {};
  for(const d of deals){
    const k=d.partner.trim().replace(/\s+/g," ");
    if(!map[k]) map[k]={partner:k,total:0,ersteRate:0,internVol:0,internCash:0,externVol:0,externCash:0,scgVol:0,scgCash:0,montano:0,cem:0,yves:0,mert:0,kada:0,soeren:0,rene:0};
    const r=map[k];
    r.total+=d.total; r.ersteRate+=d.ersteRate;
    r.internVol+=d.internVol; r.internCash+=d.internCash;
    r.externVol+=d.externVol; r.externCash+=d.externCash;
    r.scgVol+=d.scgVol; r.scgCash+=d.scgCash;
    r.montano+=d.montano; r.cem+=d.cem; r.yves+=d.yves; r.mert+=d.mert;
    r.kada+=d.kada; r.soeren+=d.soeren; r.rene+=d.rene;
  }
  return Object.values(map).sort((a,b)=>b.total-a.total);
}

function sumRows(rows:PRow[]):PRow {
  return rows.reduce((acc,r)=>({
    partner:"Gesamtsumme",total:acc.total+r.total,ersteRate:acc.ersteRate+r.ersteRate,
    internVol:acc.internVol+r.internVol,internCash:acc.internCash+r.internCash,
    externVol:acc.externVol+r.externVol,externCash:acc.externCash+r.externCash,
    scgVol:acc.scgVol+r.scgVol,scgCash:acc.scgCash+r.scgCash,
    montano:acc.montano+r.montano,cem:acc.cem+r.cem,yves:acc.yves+r.yves,mert:acc.mert+r.mert,
    kada:acc.kada+r.kada,soeren:acc.soeren+r.soeren,rene:acc.rene+r.rene
  }),{partner:"",total:0,ersteRate:0,internVol:0,internCash:0,externVol:0,externCash:0,scgVol:0,scgCash:0,montano:0,cem:0,yves:0,mert:0,kada:0,soeren:0,rene:0});
}

function decodeHtml(s: string): string {
  return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

function parseCSVLine(line: string, sep: string): string[] {
  if (sep !== ",") return line.split(sep).map(c => c.replace(/^"|"$/g,"").trim());
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { current += '"'; i++; } // escaped quote
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): Deal[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\u00a0/g," ").split("\n").map(l => l.trim()).filter(Boolean);
  const parseEur = (s: string) => {
    if (!s) return 0;
    // Remove all non-numeric chars except comma and minus
    const clean = s
      .replace(/€/g,"").replace(/\s/g,"").replace(/\u00a0/g,"")
      .replace(/\u202f/g,"").replace(/\u2009/g,"")
      .trim();
    if (!clean || clean === "-" || clean === "–") return 0;
    // German format: 1.234,56 → remove dots, replace comma with dot
    const normalized = clean.replace(/\./g,"").replace(",",".");
    return parseFloat(normalized) || 0;
  };
  const MONTH_MAP: Record<string,string> = {
    "01":"Januar","02":"Februar","03":"März","04":"April","05":"Mai",
    "06":"Juni","07":"Juli","08":"August","09":"September","10":"Oktober","11":"November","12":"Dezember"
  };

  // Find header row by looking for "Partner" or "SCG" keywords
  let headerIdx = -1;
  let sep = ",";
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const s = lines[i].includes("\t") ? "\t" : lines[i].includes(";") ? ";" : ",";
    const cols = parseCSVLine(lines[i], s).map(c => c.toLowerCase());
    if (cols.some(c => c === "partner") && cols.some(c => c === "date" || c === "datum")) {
      headerIdx = i;
      sep = s;
      break;
    }
  }

  // If no header found, fall back to fixed column positions (original behavior)
  if (headerIdx === -1) {
    const dataLines = lines.filter(l => /^\d{2}\.\d{2}\.\d{4}/.test(parseCSVLine(l,",")[1] || ""));
    return dataLines.map(line => {
      const cols = parseCSVLine(line, ",");
      const dateParts = (cols[1]||"").split(".");
      const monat = `${MONTH_MAP[dateParts[1]]||dateParts[1]} ${dateParts[2]||"2026"}`;
      return {
        datum:cols[1]||"", monat, partner:(cols[0]||"").trim(),
        total:parseEur(cols[5]), ersteRate:parseEur(cols[6]),
        intern:isInternPartner(cols[0]||""),
        setter:cols[7]||"",
        scgVol:parseEur(cols[8]), scgCash:parseEur(cols[11]),
        internVol:parseEur(cols[21]), internCash:parseEur(cols[22]),
        externVol:parseEur(cols[23]), externCash:parseEur(cols[24]),
        montano:parseEur(cols[12]), cem:parseEur(cols[13]), yves:parseEur(cols[14]),
        mert:parseEur(cols[15]), kada:parseEur(cols[17]), soeren:parseEur(cols[19]), rene:parseEur(cols[20]),
      } as Deal;
    }).filter(d => d.partner && d.datum);
  }

  // Use header row to map column names to indices
  const headers = parseCSVLine(lines[headerIdx], sep).map(c => c.toLowerCase());
  console.log("CSV Header found at line", headerIdx, ":", headers);
  console.log("Total data lines:", lines.length - headerIdx - 1);
  const col = (names: string[]) => {
    for (const n of names) {
      const idx = headers.findIndex(h => h.includes(n.toLowerCase()));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const iPartner  = col(["partner"]);
  const iDate     = col(["date","datum"]);
  const iTotal    = col(["total"]);
  const iErste    = col(["erste rate","erste_rate","ersterate"]);
  const iCloser   = col(["closer","setter"]);
  const iScgVol   = col(["scg volumen","scg_volumen"]);
  const iScgCash  = col(["scg cash in","scg_cash_in"]);
  console.log("Column indices - scgVol:", iScgVol, "scgCash:", iScgCash, "partner:", col(["partner"]), "date:", col(["date"]));
  const iMontano  = col(["montano"]);
  const iCem      = col(["cem"]);
  const iYves     = col(["yves"]);
  const iMert     = col(["mert"]);
  const iKada     = col(["kada"]);
  const iSoeren   = col(["sören","soeren"]);
  const iRene     = col(["rene"]);
  const iInternVol  = col(["intern volumen","intern_volumen"]);
  const iInternCash = col(["intern cash in","intern_cash_in"]);
  const iExternVol  = col(["extern volumen","extern_volumen"]);
  const iExternCash = col(["extern cash in","extern_cash_in"]);

  const g = (cols: string[], i: number) => i >= 0 ? (cols[i]||"") : "";
  let skipped = 0;

  return lines.slice(headerIdx + 1).map(line => {
    const cols = parseCSVLine(line, sep);
    const datum = decodeHtml(g(cols, iDate)).trim();
    const partner = decodeHtml(g(cols, iPartner)).trim();
    // Accept dates like dd.mm.yyyy or d.m.yyyy
    if (!datum || !partner || !/^\d{1,2}\.\d{1,2}\.\d{4}/.test(datum)) {
      skipped++;
      if (skipped <= 5) console.log("Skipped line:", {datum, partner, cols: cols.slice(0,3)});
      return null;
    }
    const dateParts = datum.split(".");
    const monat = `${MONTH_MAP[dateParts[1]]||dateParts[1]} ${dateParts[2]||"2026"}`;
    return {
      datum, monat, partner: partner.trim(),
      total: parseEur(g(cols,iTotal)),
      ersteRate: parseEur(g(cols,iErste)),
      intern: isInternPartner(partner),      setter: decodeHtml(g(cols,iCloser)),
      scgVol: parseEur(g(cols,iScgVol)),
      scgCash: parseEur(g(cols,iScgCash)),
      internVol: parseEur(g(cols,iInternVol)),
      internCash: parseEur(g(cols,iInternCash)),
      externVol: parseEur(g(cols,iExternVol)),
      externCash: parseEur(g(cols,iExternCash)),
      montano: parseEur(g(cols,iMontano)),
      cem: parseEur(g(cols,iCem)),
      yves: parseEur(g(cols,iYves)),
      mert: parseEur(g(cols,iMert)),
      kada: parseEur(g(cols,iKada)),
      soeren: parseEur(g(cols,iSoeren)),
      rene: parseEur(g(cols,iRene)),
    } as Deal;
  }).filter(Boolean) as Deal[];
}

const PASSWORD = "HHSales3!";
const PASSWORD2 = "Sales!";

// ============================================================
// FIRMEN DASHBOARD
// ============================================================
type FirmaData = {
  firma: string; short: string; color: string; icon: string; currency: string;
  ein: number; aus: number;
  einDetails: [string, number][]; ausDetails: [string, number][];
  bwaKategorien?: {kat: string; icon: string; items: string[]}[];
};

const FDATA: FirmaData[] = [
  { firma:"HH Sales Consulting Germany GmbH", short:"HH SCG", color:"#818cf8", icon:"📊", currency:"EUR",
    ein:367319.29, aus:-295063.03,
    einDetails:[["No Limits Consulting Miete",1706.98],["Allianz Rückgabe",3649.71],["Everflow Excellence",16755.20],["Eitel Invest AG",16376.66],["Grundl Leadership",35394.78],["Schippke Partner",39214.00],["ECOM HOUSE",86933.04],["Arlind Nuhi",5623.87],["SocialNatives",2659.65],["Candidate Flow",94076.72],["AIRWALLEX",1916.95],["Hamann Kollegen",23972.85],["2B AHEAD",36248.74],["Sonstiges",2789.82]],
    ausDetails:[["Löhne",-73125.16],["Finanzamt",-60021.49],["HP Venius Dubai",-49169.05],["Krankenkassen",-28878.74],["Dienstleistungen",-25300.00],["Miete",-21471.28],["Leasing",-13133.00],["Autoversicherung",-5055.25],["Reisekosten",-4687.41],["Software",-3524.37],["Lebensversicherung",-1352.00],["Versicherung",-1079.57],["Steuerberatung",-683.06],["Sonstiges",-5582.60]],
    bwaKategorien:[
      {kat:"Gehälter & Löhne", icon:"👥", items:["Löhne"]},
      {kat:"Steuern & Finanzamt", icon:"🏛️", items:["Finanzamt","Steuerberatung"]},
      {kat:"Miete & Nebenkosten", icon:"🏠", items:["Miete"]},
      {kat:"Leasing & Fahrzeuge", icon:"🚗", items:["Leasing","Autoversicherung"]},
      {kat:"Krankenkassen", icon:"🏥", items:["Krankenkassen"]},
      {kat:"Versicherungen", icon:"🛡️", items:["Lebensversicherung","Versicherung"]},
      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},
      {kat:"Reisekosten", icon:"✈️", items:["Reisekosten"]},
      {kat:"Dienstleistungen", icon:"🔧", items:["Dienstleistungen","HP Venius Dubai"]},
      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},
    ]},
  { firma:"Peak Revenue AG", short:"Peak Revenue", color:"#34d399", icon:"🇨🇭", currency:"CHF",
    ein:118334.09, aus:-36361.29,
    einDetails:[["Aktienkapital Zürich",99875.00],["Investmentpunk",3093.70],["Leon Ioakeim",4555.39],["Tax Angels",10810.00]],
    ausDetails:[["Kapitaleinlage Hamann",-23320.88],["Steckel Legal Tax",-9080.40],["Reviso Treuhand",-1081.00],["Fechner Rechtsanwälte",-781.57],["Steuern",-590.00],["Software",-306.47],["Sonstiges",-1201.97]],
    bwaKategorien:[
      {kat:"Steuern & Abgaben", icon:"🏛️", items:["Steuern","Reviso Treuhand","Steckel Legal Tax"]},
      {kat:"Rechtsberatung", icon:"⚖️", items:["Fechner Rechtsanwälte"]},
      {kat:"Kapitaleinlagen", icon:"💼", items:["Kapitaleinlage Hamann"]},
      {kat:"Tools & Software", icon:"🛠️", items:["Software"]},
      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},
    ]},
  { firma:"HP Venius", short:"HP Venius", color:"#f59e0b", icon:"🏢", currency:"EUR",
    ein:68515.14, aus:-70017.52,
    einDetails:[["HH Sales Consulting",49019.49],["M S V T Marketing",15724.73],["CopeCart",3518.18],["NIKO DIECKHOFF",252.74]],
    ausDetails:[["Sülei Tatli Lohn",-54480.00],["Lukas Jukic Lohn",-4370.00],["Taim Shakir Lohn",-3600.00],["Florian Schimpf Lohn",-2400.00],["FTA Steuer",-3021.50],["Transfer DTB 1",-1605.00],["Transfer DTB 2",-461.48],["Bankgebühren",-75.80],["Sonstiges",-3.74]],
    bwaKategorien:[
      {kat:"Gehälter & Löhne", icon:"👥", items:["Sülei Tatli Lohn","Lukas Jukic Lohn","Taim Shakir Lohn","Florian Schimpf Lohn"]},
      {kat:"Steuern & Abgaben", icon:"🏛️", items:["FTA Steuer"]},
      {kat:"Überweisungen", icon:"💸", items:["Transfer DTB 1","Transfer DTB 2"]},
      {kat:"Bankgebühren", icon:"🏦", items:["Bankgebühren"]},
      {kat:"Sonstiges", icon:"📦", items:["Sonstiges"]},
    ]},
  { firma:"Hamann & Kollegen Immobilien GmbH", short:"Hamann & Kollegen", color:"#f472b6", icon:"🏠", currency:"EUR",
    ein:73861.00, aus:-25605.48,
    einDetails:[["WHITE.IMMOBILIEN GMBH",48861.00],["Zahlung aus Ausland",25000.00]],
    ausDetails:[["HH SCG Zahlungen",-23972.85],["KROOS KOLLEGEN",-808.74],["Facebook Ads",-536.00],["CLOSE CRM",-151.03],["AMTSGERICHT",-300.00],["PIXELFLOW",-16.52],["WEBFLOW",-18.54],["Kontoführung",-14.80]],
    bwaKategorien:[
      {kat:"Dienstleistungen", icon:"🔧", items:["HH SCG Zahlungen","KROOS KOLLEGEN"]},
      {kat:"Marketing & Werbung", icon:"📣", items:["Facebook Ads"]},
      {kat:"Tools & Software", icon:"🛠️", items:["CLOSE CRM","PIXELFLOW","WEBFLOW"]},
      {kat:"Gebühren & Abgaben", icon:"🏛️", items:["AMTSGERICHT","Kontoführung"]},
    ]},
];

const FIRMEN_NEW_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYYsY8LCNoYUVl-Hi4yPb_w7vVrx-AuhNh0wcVuxKeevlndP7IdyzwGO6t8ckisPVoDWMVhnSyGlXv/pub?output=csv";

const MONAT_TO_GID: Record<string,string> = {
  "April 2026": "0",
  "Mai 2026": "494571505",
  "Juni 2026": "225408471",
  "Juli 2026": "17042631",
  "August 2026": "487893367",
  "September 2026": "650407477",
  "Oktober 2026": "62636800",
  "November 2026": "1316786435",
  "Dezember 2026": "379786663",
};

// Keyword-based BWA auto-categorizer — verified against real April 2026 bookings
const BWA_KEYWORD_MAP: Record<string, {kat: string; icon: string; keywords: string[]}[]> = {
  "HH Sales Consulting Germany GmbH": [
    {kat:"Steuern & Finanzamt", icon:"🏛️", keywords:[
      "finanzamt","landeshauptkasse","lohnst","ums.st","steuerber","bd berlin digital tax","digital tax","steuer",
    ]},
    {kat:"Gehälter & Löhne", icon:"👥", keywords:[
      "lohn","gehalt","salary",
    ]},
    {kat:"Miete & Nebenkosten", icon:"🏠", keywords:[
      "miete","collection business centers","aik immobilien","nebenkosten","enercity","strom",
    ]},
    {kat:"Leasing & Fahrzeuge", icon:"🚗", keywords:[
      "leasing","porsche financial","mercedes-benz leasing","vw leasing","kfz-steuer","bundeskasse kfz","autoversicherung","kfz-versiche",
    ]},
    {kat:"Krankenkassen & Sozialabgaben", icon:"🏥", keywords:[
      "krankenkasse","krankenkass","bkk","aok","debeka","techniker","hkk","handelskrankenkasse","hanseatische","r+v betriebs","deutsche rentenversicherung","rentenversicherung",
    ]},
    {kat:"Versicherungen", icon:"🛡️", keywords:[
      "lebensvers","arag","rechtsschutz","markel insurance","versicherung","insurance",
    ]},
    {kat:"Tools & Software", icon:"🛠️", keywords:[
      "close crm","slack","zoom","google workspace","google cloud","monday","calendly","zapier","anthropic","claude.ai","webflow","pixelflow","hostinger","ionos","atlassian","jotform","vimeo","vmo*vimeo","jumpshare","cookiebot","paddle","easybill","recruitee","stitchdata","figma","airtable","notion","adobe","microsoft","openai","1password","hubspot","clickup","asana","miro","typeform","loom","shopify","wix","canva","deepl","grammarly","chatgpt","midjourney","make.com","pipedrive","app store","play store","telekom","vodafone","o2 ","mobilfunk","festnetz",
    ]},
    {kat:"Reisekosten", icon:"✈️", keywords:[
      "reise","rückerstattung","db vertrieb","deutsche bahn","partners on booking","booking.com","hotel","airbnb","tankstelle","sb-tank","aral","hem tank","taxi","uber","mietwagen","parkhaus","flug","bahnticket","fahrtkosten","bahn)",
    ]},
    {kat:"Dienstleistungen", icon:"🔧", keywords:[
      "hp venius","skalator","stefan michalea","moritz winter","pineapple consult","dienstleist","beratung","consulting","agentur","freelance","honorar","subunternehm",
    ]},
    {kat:"Marketing & Werbung", icon:"📣", keywords:[
      "facebook ads","facebk","paypal *facebook","google ads","meta ads","instagram","tiktok","linkedin ads","werbung","marketing ads",
    ]},
    {kat:"Bankgebühren", icon:"🏦", keywords:[
      "kontoführung","bankgebühr","bank ","wise fee","paypal fee","stripe fee","airwallex fee",
    ]},
    {kat:"Sonstiges", icon:"📦", keywords:[]},
  ],
  "Peak Revenue AG": [
    {kat:"Steuern & Abgaben", icon:"🏛️", keywords:[
      "steuer","steuern","tax","finanzverwaltung","nidwalden","reviso","treuhand","steckel",
    ]},
    {kat:"Rechtsberatung", icon:"⚖️", keywords:[
      "rechtsanwalt","anwalt","legal","notar","kanzlei","gericht","fechner",
    ]},
    {kat:"Kapitaleinlagen", icon:"💼", keywords:[
      "kapitaleinlage","einlage","aktienkapital","stammkapital",
    ]},
    {kat:"Tools & Software", icon:"🛠️", keywords:[
      "slack","notion","zoom","microsoft","adobe","hostinger","close crm","webflow","pixelflow","app store","figma","airtable","lovable","perplexity","paddle","n8n","manus ai","openai","anthropic","claude","canva","loom","miro","typeform","calendly","zapier","atlassian","jotform","vimeo","jumpshare","monday","ionos","chatgpt","midjourney","make.com","1password","hubspot",
    ]},
    {kat:"Bankgebühren", icon:"🏦", keywords:[
      "bankgebühr","kontoführung","zahlungsverkehrspreis","wise","paypal fee","stripe fee",
    ]},
    {kat:"Sonstiges", icon:"📦", keywords:[]},
  ],
  "HP Venius": [
    {kat:"Gehälter & Löhne", icon:"👥", keywords:[
      "lohn","gehalt","salary","tatli","jukic","shakir","schimpf","greif",
    ]},
    {kat:"Steuern & Abgaben", icon:"🏛️", keywords:[
      "fta","federal tax","tax authority","value added tax","vat","steuer",
    ]},
    {kat:"Überweisungen", icon:"💸", keywords:[
      "transfer","überweisung","dtb","übertrag",
    ]},
    {kat:"Bankgebühren", icon:"🏦", keywords:[
      "bankgebühr","kontoführung","maintenance of balance","min bal fee","balance fee","wise fee","seg pfa",
    ]},
    {kat:"Sonstiges", icon:"📦", keywords:[]},
  ],
  "Hamann & Kollegen Immobilien GmbH": [
    {kat:"Dienstleistungen", icon:"🔧", keywords:[
      "hh scg","hh sales","kroos","dienstleist","beratung","consulting","honorar",
    ]},
    {kat:"Marketing & Werbung", icon:"📣", keywords:[
      "facebook ads","facebk","google ads","meta ads","instagram","tiktok","linkedin ads","werbung","marketing",
    ]},
    {kat:"Tools & Software", icon:"🛠️", keywords:[
      "close crm","pixelflow","webflow","software","saas","slack","notion","hostinger","app store","atlassian","zapier","monday","zoom","figma","airtable","canva","loom","miro","typeform","calendly","jotform","vimeo","jumpshare","ionos","chatgpt","openai","anthropic","claude","paddle","lovable","perplexity",
    ]},
    {kat:"Gebühren & Abgaben", icon:"🏛️", keywords:[
      "amtsgericht","gericht","notar","notargebühr","grundbuch","kontoführung","bankgebühr",
    ]},
    {kat:"Sonstiges", icon:"📦", keywords:[]},
  ],
};

function autoKategorisiere(name: string, firma: string): string {
  const cats = BWA_KEYWORD_MAP[firma];
  if (!cats) return "Sonstiges";
  const n = name.toLowerCase();
  for (const cat of cats) {
    if (cat.keywords.length === 0) continue;
    if (cat.keywords.some(kw => n.includes(kw.toLowerCase()))) return cat.kat;
  }
  return "Sonstiges";
}

function buildFirmenData(rows: {firma:string;datum:string;name:string;betrag:number;kategorie:string;monat:string}[], monat: string) {
  const FIRMEN_CFG = [
    {firma:"HH Sales Consulting Germany GmbH", short:"HH SCG", color:"#818cf8", icon:"📊", currency:"EUR"},
    {firma:"Peak Revenue AG", short:"Peak Revenue", color:"#34d399", icon:"🇨🇭", currency:"CHF"},
    {firma:"HP Venius", short:"HP Venius", color:"#f59e0b", icon:"🏢", currency:"EUR"},
    {firma:"Hamann & Kollegen Immobilien GmbH", short:"Hamann & Kollegen", color:"#f472b6", icon:"🏠", currency:"EUR"},
  ];
  return FIRMEN_CFG.map(cfg => {
    const firmaRows = rows.filter(r => r.firma === cfg.firma && r.monat === monat);
    const einRows = firmaRows.filter(r => r.betrag > 0);
    const ausRows = firmaRows.filter(r => r.betrag < 0);
    const ein = einRows.reduce((a,r) => a+r.betrag, 0);
    const aus = ausRows.reduce((a,r) => a+r.betrag, 0);
    const einMap: Record<string,number> = {};
    einRows.forEach(r => { einMap[r.name] = (einMap[r.name]||0) + r.betrag; });
    const ausMap: Record<string,number> = {};
    ausRows.forEach(r => { ausMap[r.name] = (ausMap[r.name]||0) + r.betrag; });
    const ausDetails = Object.entries(ausMap).sort((a,b)=>a[1]-b[1]).slice(0,60) as [string,number][];
    const catDefs = BWA_KEYWORD_MAP[cfg.firma] || [];
    const catMap: Record<string, [string,number][]> = {};
    for (const [name, val] of ausDetails) {
      const kat = autoKategorisiere(name, cfg.firma);
      if (!catMap[kat]) catMap[kat] = [];
      catMap[kat].push([name, val]);
    }
    const bwaKategorien = catDefs
      .map(({kat, icon}) => ({kat, icon, items: (catMap[kat]||[]).map(([n])=>n)}))
      .filter(c => c.items.length > 0);
    return {
      ...cfg, ein, aus,
      einDetails: Object.entries(einMap).sort((a,b)=>b[1]-a[1]).slice(0,15) as [string,number][],
      ausDetails,
      bwaKategorien,
    };
  });
}

function FirmenDashboard({onLogout}:{onLogout:()=>void}) {
  const [selFirma, setSelFirma] = useState<string|null>(null);
  const [detailTab, setDetailTab] = useState<"uebersicht"|"bwa">("uebersicht");
  const [selMonat, setSelMonat] = useState("April 2026");
  const [allRows, setAllRows] = useState<{firma:string;datum:string;name:string;betrag:number;kategorie:string;monat:string}[]>([]);
  const [liveStatus, setLiveStatus] = useState<"idle"|"success"|"error">("idle");
  const C = {bg:"#f0f2f5",sidebar:"#ffffff",card:"#ffffff",border:"#e2e8f0",text:"#1a202c",muted:"#64748b",green:"#059669",pink:"#dc2626",indigo:"#4f46e5"};
  const fmtN = (n: number) => new Intl.NumberFormat("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Math.abs(n));

  async function loadMonat(monat: string) {
    const gid = MONAT_TO_GID[monat] ?? "0";
    try {
      const res = await fetch("/api/firmen?gid=" + gid + "&t=" + Date.now(), {cache:"no-store"});
      const text = await res.text();
      const rows = parseFirmenCSV(text);
      if (rows.length === 0) { setLiveStatus("error"); return; }
      setAllRows(rows);
      setLiveStatus("success");
    } catch {
      setLiveStatus("error");
    }
  }

  useEffect(() => {
    loadMonat(selMonat);
    const iv = setInterval(() => loadMonat(selMonat), 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, [selMonat]);

  const liveData = allRows.length > 0 ? buildFirmenData(allRows, selMonat) : null;
  const data = liveData ?? FDATA;
  const f = selFirma ? (data.find(x=>x.firma===selFirma) ?? data[0]) : null;

  // Gesamtsaldo aller Firmen (EUR only)
  const totalEin = data.filter(fi=>fi.currency==="EUR").reduce((a,fi)=>a+fi.ein,0);
  const totalAus = data.filter(fi=>fi.currency==="EUR").reduce((a,fi)=>a+fi.aus,0);
  const totalSaldo = totalEin + totalAus;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','Inter',sans-serif"}}>
      <div style={{background:C.sidebar,borderBottom:`1px solid ${C.border}`,padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:20,fontWeight:800}}>🏢 Jahresübersicht 4 Firmen</div>
          <div style={{fontSize:13,color:C.muted,letterSpacing:"2px"}}>{selMonat.toUpperCase()}</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{padding:"5px 12px",borderRadius:20,fontSize:13,fontWeight:700,
            background:liveStatus==="success"?"#0a2a10":liveStatus==="error"?"#0a0a1a":"#13132a",
            border:`1px solid ${liveStatus==="success"?"#1a5a25":"#252538"}`,
            color:liveStatus==="success"?C.green:C.muted}}>
            {liveStatus==="success"?"● LIVE":liveStatus==="error"?"● Offline":"⟳ Lädt..."}
          </div>
          <select value={selMonat} onChange={e=>setSelMonat(e.target.value)} style={{padding:"6px 14px",borderRadius:8,fontSize:14,fontWeight:700,background:"#1a1a2e",color:C.indigo,border:`1px solid #2a2a50`,cursor:"pointer",outline:"none"}}>
            {["April 2026","Mai 2026","Juni 2026","Juli 2026","August 2026","September 2026","Oktober 2026","November 2026","Dezember 2026"].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          {selFirma && <button onClick={()=>setSelFirma(null)} style={{padding:"6px 14px",borderRadius:8,fontSize:14,color:C.indigo,background:"transparent",border:`1px solid ${C.indigo}`,cursor:"pointer"}}>← Zurück</button>}
          <button onClick={onLogout} style={{padding:"6px 14px",borderRadius:8,fontSize:14,color:C.muted,background:"transparent",border:`1px solid ${C.border}`,cursor:"pointer"}}>Abmelden</button>
        </div>
      </div>
      <div style={{padding:"28px 32px"}}>
        {!selFirma ? (
          <>
            {/* Gesamtsaldo EUR */}
            <div style={{fontSize:12,color:C.muted,letterSpacing:"2px",marginBottom:8,fontWeight:700}}>EUR FIRMEN</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:16}}>
              <div style={{background:"#0a2a10",border:"1px solid #1a5a25",borderRadius:12,padding:20,textAlign:"center"}}>
                <div style={{fontSize:13,color:C.green,marginBottom:4,letterSpacing:"1px"}}>GESAMT EINNAHMEN (EUR)</div>
                <div style={{fontSize:20,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{fmtN(totalEin)}</div>
              </div>
              <div style={{background:"#2a0a10",border:"1px solid #5a1a25",borderRadius:12,padding:20,textAlign:"center"}}>
                <div style={{fontSize:13,color:C.pink,marginBottom:4,letterSpacing:"1px"}}>GESAMT AUSGABEN (EUR)</div>
                <div style={{fontSize:20,fontWeight:800,color:C.pink,fontFamily:"monospace"}}>{fmtN(totalAus)}</div>
              </div>
              <div style={{background:totalSaldo>=0?"#0a2a10":"#2a0a10",border:`1px solid ${totalSaldo>=0?"#1a5a25":"#5a1a25"}`,borderRadius:12,padding:20,textAlign:"center"}}>
                <div style={{fontSize:13,color:totalSaldo>=0?C.green:C.pink,marginBottom:4,letterSpacing:"1px"}}>GESAMT SALDO (EUR)</div>
                <div style={{fontSize:24,fontWeight:800,color:totalSaldo>=0?C.green:C.pink,fontFamily:"monospace"}}>{totalSaldo>=0?"+":"-"}{fmtN(totalSaldo)}</div>
              </div>
            </div>
            {/* Gesamtsaldo CHF */}
            {(() => {
              const chfEin = data.filter(fi=>fi.currency==="CHF").reduce((a,fi)=>a+fi.ein,0);
              const chfAus = data.filter(fi=>fi.currency==="CHF").reduce((a,fi)=>a+fi.aus,0);
              const chfSaldo = chfEin + chfAus;
              return (
                <>
                  <div style={{fontSize:12,color:C.muted,letterSpacing:"2px",marginBottom:8,fontWeight:700}}>CHF FIRMEN</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:28}}>
                    <div style={{background:"#0a2a10",border:"1px solid #1a5a25",borderRadius:12,padding:20,textAlign:"center"}}>
                      <div style={{fontSize:13,color:C.green,marginBottom:4,letterSpacing:"1px"}}>GESAMT EINNAHMEN (CHF)</div>
                      <div style={{fontSize:20,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{fmtN(chfEin)}</div>
                    </div>
                    <div style={{background:"#2a0a10",border:"1px solid #5a1a25",borderRadius:12,padding:20,textAlign:"center"}}>
                      <div style={{fontSize:13,color:C.pink,marginBottom:4,letterSpacing:"1px"}}>GESAMT AUSGABEN (CHF)</div>
                      <div style={{fontSize:20,fontWeight:800,color:C.pink,fontFamily:"monospace"}}>{fmtN(chfAus)}</div>
                    </div>
                    <div style={{background:chfSaldo>=0?"#0a2a10":"#2a0a10",border:`1px solid ${chfSaldo>=0?"#1a5a25":"#5a1a25"}`,borderRadius:12,padding:20,textAlign:"center"}}>
                      <div style={{fontSize:13,color:chfSaldo>=0?C.green:C.pink,marginBottom:4,letterSpacing:"1px"}}>GESAMT SALDO (CHF)</div>
                      <div style={{fontSize:24,fontWeight:800,color:chfSaldo>=0?C.green:C.pink,fontFamily:"monospace"}}>{chfSaldo>=0?"+":"-"}{fmtN(chfSaldo)}</div>
                    </div>
                  </div>
                </>
              );
            })()}
            {/* Firma Karten */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
            {data.map(fi=>{
              const saldo = fi.ein + fi.aus;
              return (
                <div key={fi.firma} onClick={()=>setSelFirma(fi.firma)} style={{background:C.card,border:`1px solid ${C.border}`,borderTop:`3px solid ${fi.color}`,borderRadius:12,padding:24,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                    <span style={{fontSize:24}}>{fi.icon}</span>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:fi.color}}>{fi.short}</div>
                      <div style={{fontSize:12,color:C.muted}}>{selMonat} · {fi.currency}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,color:C.muted}}>✅ Einnahmen</span>
                      <span style={{fontSize:14,fontWeight:700,color:C.green,fontFamily:"monospace"}}>{fmtN(fi.ein)} {fi.currency}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,color:C.muted}}>📤 Ausgaben</span>
                      <span style={{fontSize:14,fontWeight:700,color:C.pink,fontFamily:"monospace"}}>{fmtN(fi.aus)} {fi.currency}</span>
                    </div>
                    <div style={{height:1,background:C.border}}/>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:14,fontWeight:700}}>💰 Saldo</span>
                      <span style={{fontSize:16,fontWeight:800,color:saldo>=0?C.green:C.pink,fontFamily:"monospace"}}>{saldo>=0?"+":"-"}{fmtN(saldo)} {fi.currency}</span>
                    </div>
                  </div>
                  <div style={{marginTop:12,fontSize:12,color:C.muted,textAlign:"right"}}>Details anzeigen →</div>
                </div>
              );
            })}
            </div>
          </>
        ) : f ? (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <span style={{fontSize:28}}>{f.icon}</span>
              <div>
                <div style={{fontSize:20,fontWeight:800,color:f.color}}>{f.short}</div>
                <div style={{fontSize:14,color:C.muted}}>{selMonat} · {f.currency}</div>
              </div>
            </div>
            {/* Tabs */}
            <div style={{display:"flex",gap:8,marginBottom:24}}>
              {(["uebersicht","bwa"] as const).map(tab=>(
                <button key={tab} onClick={()=>setDetailTab(tab)} style={{padding:"8px 20px",borderRadius:20,fontSize:14,fontWeight:700,cursor:"pointer",border:"none",
                  background:detailTab===tab?f.color:"#1a1a2e",
                  color:detailTab===tab?"#fff":C.muted}}>
                  {tab==="uebersicht"?"📊 Übersicht":"📋 BWA"}
                </button>
              ))}
            </div>
            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              <div style={{background:"#0a2a10",border:"1px solid #1a5a25",borderRadius:12,padding:16,textAlign:"center"}}>
                <div style={{fontSize:13,color:C.green,marginBottom:4,letterSpacing:"1px"}}>EINNAHMEN</div>
                <div style={{fontSize:22,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{fmtN(f.ein)}</div>
                <div style={{fontSize:13,color:C.muted}}>{f.currency}</div>
              </div>
              <div style={{background:"#2a0a10",border:"1px solid #5a1a25",borderRadius:12,padding:16,textAlign:"center"}}>
                <div style={{fontSize:13,color:C.pink,marginBottom:4,letterSpacing:"1px"}}>AUSGABEN</div>
                <div style={{fontSize:22,fontWeight:800,color:C.pink,fontFamily:"monospace"}}>{fmtN(f.aus)}</div>
                <div style={{fontSize:13,color:C.muted}}>{f.currency}</div>
              </div>
            </div>
            <div style={{background:(f.ein+f.aus)>=0?"#0a2a10":"#2a0a10",border:`1px solid ${(f.ein+f.aus)>=0?"#1a5a25":"#5a1a25"}`,borderRadius:12,padding:16,textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:13,color:C.muted,marginBottom:4,letterSpacing:"1px"}}>NETTO SALDO</div>
              <div style={{fontSize:28,fontWeight:800,color:(f.ein+f.aus)>=0?C.green:C.pink,fontFamily:"monospace"}}>{(f.ein+f.aus)>=0?"+":"-"}{fmtN(f.ein+f.aus)} {f.currency}</div>
            </div>

            {detailTab==="uebersicht" ? (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.green,marginBottom:12,letterSpacing:"1px"}}>✅ EINNAHMEN DETAIL</div>
                  <div style={{background:"#0d0d1f",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                    {f.einDetails.map(([n,v],i)=>{
                      const sn=n.replace(/End-to-End-Ref\..*$/i,"").replace(/End-To-End-Ref\..*$/i,"").replace(/Mandatsref.*$/i,"").replace(/Karte Nr\..*$/i,"").replace(/Kartenzahlung.*$/i,"").replace(/\bDE\d{2}\w+\b/g,"").replace(/\s{2,}/g," ").trim().slice(0,40);
                      return (
                      <div key={i} style={{padding:"9px 14px",borderBottom:i<f.einDetails.length-1?`1px solid ${C.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:i%2===0?"transparent":"#0c0c1a"}}>
                        <span style={{fontSize:13,color:"#ffffff",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={n}>{sn}</span>
                        <span style={{fontSize:13,fontWeight:700,color:C.green,fontFamily:"monospace",whiteSpace:"nowrap",flexShrink:0}}>{fmtN(v)} {f.currency}</span>
                      </div>
                      );
                    })}
                    <div style={{padding:"9px 14px",borderTop:`2px solid ${C.border}`,display:"flex",justifyContent:"space-between",background:"#0a0a15"}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#ffffff"}}>Gesamt</span>
                      <span style={{fontSize:14,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{fmtN(f.ein)} {f.currency}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.pink,marginBottom:12,letterSpacing:"1px"}}>📤 AUSGABEN DETAIL</div>
                  <div style={{background:"#0d0d1f",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                    {f.ausDetails.map(([n,v],i)=>{
                      const sn=n.replace(/End-to-End-Ref\..*$/i,"").replace(/End-To-End-Ref\..*$/i,"").replace(/Mandatsref.*$/i,"").replace(/Karte Nr\..*$/i,"").replace(/Kartenzahlung.*$/i,"").replace(/\bDE\d{2}\w+\b/g,"").replace(/\bAE\d{2}\w+\b/g,"").replace(/GENODEM\w+|DRESDEFF\w+|COBADEFF\w+|NOLADE\w+|SPKHDE\w+|HASPDE\w+|WIBADE\w+|SOLADE\w+|REVODEB\w+|NTSBDEB\w+|SOBKDEB\w+|COKSDE\w+|FNOMDEB\w+|SSKMDEMMXXX|TRWIBEB\w+|PBNKDEFF\w+|VOWADE\w+|HELADEF\w+|DEUTDEDB\w+|VOHADE\w+|GENODEF\w+/g,"").replace(/\s{2,}/g," ").trim().slice(0,40);
                      return (
                      <div key={i} style={{padding:"9px 14px",borderBottom:i<f.ausDetails.length-1?`1px solid ${C.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:i%2===0?"transparent":"#0c0c1a"}}>
                        <span style={{fontSize:13,color:"#ffffff",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={n}>{sn}</span>
                        <span style={{fontSize:13,fontWeight:700,color:C.pink,fontFamily:"monospace",whiteSpace:"nowrap",flexShrink:0}}>{fmtN(v)} {f.currency}</span>
                      </div>
                      );
                    })}
                    <div style={{padding:"9px 14px",borderTop:`2px solid ${C.border}`,display:"flex",justifyContent:"space-between",background:"#0a0a15"}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#ffffff"}}>Gesamt</span>
                      <span style={{fontSize:14,fontWeight:800,color:C.pink,fontFamily:"monospace"}}>{fmtN(f.aus)} {f.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.muted,marginBottom:16,letterSpacing:"1px"}}>📋 BWA — {f.short} — {selMonat}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
                  {(f.bwaKategorien || []).map(({kat,icon,items})=>{
                    const total = f.ausDetails.filter(([n])=>items.includes(n)).reduce((a,[,v])=>a+v,0);
                    const rows = f.ausDetails.filter(([n])=>items.includes(n));
                    if (rows.length===0) return null;
                    return (
                      <div key={kat} style={{background:"#0d0d1f",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                        <div style={{padding:"12px 16px",background:"#0a0a18",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:15,fontWeight:700,color:"#ffffff"}}>{icon} {kat}</span>
                          <span style={{fontSize:15,fontWeight:800,color:C.pink,fontFamily:"monospace"}}>{fmtN(total)} {f.currency}</span>
                        </div>
                        {rows.map(([n,v],i)=>{
                          const shortName = n
                            .replace(/End-to-End-Ref\..*$/i,"")
                            .replace(/End-To-End-Ref\..*$/i,"")
                            .replace(/Mandatsref.*$/i,"")
                            .replace(/Gläubiger-ID.*$/i,"")
                            .replace(/SEPA-BASISLASTSCHRIFT.*$/i,"")
                            .replace(/Karte Nr\..*$/i,"")
                            .replace(/Kartenzahlung.*$/i,"")
                            .replace(/\bDE\d{2}\w+\b/g,"")
                            .replace(/\bAE\d{2}\w+\b/g,"")
                            .replace(/GENODEM\w+|DRESDEFF\w+|COBADEFF\w+|NOLADE\w+|SPKHDE\w+|HASPDE\w+|WIBADE\w+|SOLADE\w+|REVODEB\w+|NTSBDEB\w+|SOBKDEB\w+|COKSDE\w+|FNOMDEB\w+|SSKMDEMMXXX|TRWIBEB\w+|PBNKDEFF\w+|VOWADE\w+|HELADEF\w+|DEUTDEDB\w+|VOHADE\w+|GENODEF\w+/g,"")
                            .replace(/\s{2,}/g," ")
                            .replace(/,\s*$/,"")
                            .trim()
                            .slice(0,45);
                          return (
                          <div key={i} style={{padding:"8px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,background:i%2===0?"transparent":"#0c0c1a"}}>
                            <span style={{fontSize:13,color:"#ffffff",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={n}>{shortName}</span>
                            <span style={{fontSize:13,color:C.pink,fontFamily:"monospace",whiteSpace:"nowrap",flexShrink:0}}>{fmtN(v)} {f.currency}</span>
                          </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:20,background:"#0a0a18",border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:15,fontWeight:700,color:"#ffffff"}}>📊 Gesamt Ausgaben</span>
                  <span style={{fontSize:18,fontWeight:800,color:C.pink,fontFamily:"monospace"}}>{fmtN(f.aus)} {f.currency}</span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
const FIRMEN_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYYsY8LCNoYUVl-Hi4yPb_w7vVrx-AuhNh0wcVuxKeevlndP7ldyzwGO6t8ckisPVoDWMVhnSyGlXv/pub?output=csv";

async function fetchFirmenSheet(gid = "0") {
  const res = await fetch("/api/firmen?gid=" + gid + "&t=" + Date.now(), {cache: "no-store"});
  return res.text();
}

function parseCSVLine2(line: string): string[] {
  const cols: string[] = [];
  let cur = ""; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ""; }
    else { cur += c; }
  }
  cols.push(cur.trim());
  return cols;
}

function parseFirmenCSV(text: string): {firma:string; datum:string; name:string; betrag:number; kategorie:string; monat:string}[] {
  const lines = text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
  const result: {firma:string; datum:string; name:string; betrag:number; kategorie:string; monat:string}[] = [];
  
  const parseNum = (s: string) => {
    if (!s) return null;
    const clean = s.replace(/Fr\./g,"").replace(/Fr /g,"").replace(/€/g,"").replace(/\s/g,"").replace(/[\u00a0\u202f]/g,"").replace(/\./g,"").replace(",",".").replace("−","-").replace("–","-").trim();
    if (!clean || clean==="-") return null;
    const n = parseFloat(clean);
    return isNaN(n) ? null : n;
  };

  const FIRMEN_MARKERS = ["HH Sales Consulting Germany GmbH","Peak Revenue AG","HP Venius","Hamann & Kollegen Immobilien GmbH","Hamann & Kollegen","Hamann + Kollegen","Hamann+Kollegen","Hamann und Kollegen"];
  const FIRMA_NORMALIZE = (s: string) => {
    if (s.includes("Hamann")) return "Hamann & Kollegen Immobilien GmbH";
    if (s.includes("Peak Revenue")) return "Peak Revenue AG";
    if (s.includes("HP Venius")) return "HP Venius";
    if (s.includes("HH Sales")) return "HH Sales Consulting Germany GmbH";
    return s;
  };
  const MONAT_MAP: Record<string,string> = {"01":"Januar","02":"Februar","03":"März","04":"April","05":"Mai","06":"Juni","07":"Juli","08":"August","09":"September","10":"Oktober","11":"November","12":"Dezember"};
  
  let currentFirma = "";
  let inData = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cols = parseCSVLine2(line);
    
    // Check if this line marks a new firma
    const firmaMatch = FIRMEN_MARKERS.find(f => cols[0]?.includes(f) || cols[0] === f);
    if (firmaMatch) {
      currentFirma = FIRMA_NORMALIZE(firmaMatch);
      inData = false;
      continue;
    }
    
    // Check if header row
    if (cols[0]?.toLowerCase() === "datum") {
      inData = true;
      continue;
    }
    
    if (!inData || !currentFirma) continue;
    
    // Einnahmen: cols 0,1,2 — Ausgaben: cols 5,6,7,8
    const einDatum = cols[0]||""; const einName = cols[1]||""; const einBetrag = parseNum(cols[2]||"");
    const ausDatum = cols[5]||""; const ausName = cols[6]||""; const ausBetrag = parseNum(cols[7]||""); const ausKat = cols[8]||"";
    
    if (einDatum && /\d{1,2}[\.\-]\d{2}[\.\-]\d{4}/.test(einDatum) && einBetrag !== null && einBetrag > 0) {
      const parts = einDatum.replace(/-/g,".").split(".");
      const mm = parts[1]; const yy = parts[2];
      result.push({firma:currentFirma, datum:einDatum, name:einName, betrag:einBetrag, kategorie:"Einnahmen", monat:(MONAT_MAP[mm]||mm)+" "+yy});
    }
    if (ausDatum && /\d{1,2}[\.\-]\d{2}[\.\-]\d{4}/.test(ausDatum) && ausBetrag !== null && ausBetrag < 0) {
      const parts = ausDatum.replace(/-/g,".").split(".");
      const mm = parts[1]; const yy = parts[2];
      result.push({firma:currentFirma, datum:ausDatum, name:ausName, betrag:ausBetrag, kategorie:ausKat||"Ausgaben", monat:(MONAT_MAP[mm]||mm)+" "+yy});
    }
  }
  return result;
}

function beantworteFrageLokal(frage: string, deals: Deal[]): string {
  const f = frage.toLowerCase();
  const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  const fmt = (n:number) => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n);

  // Today/yesterday support
  const today = new Date();
  const pad = (n:number) => String(n).padStart(2,'0');
  const todayStr = `${pad(today.getDate())}.${pad(today.getMonth()+1)}.${today.getFullYear()}`;
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const yesterdayStr = `${pad(yesterday.getDate())}.${pad(yesterday.getMonth()+1)}.${yesterday.getFullYear()}`;

  const isHeute = f.includes("heute");
  const isGestern = f.includes("gestern");
  const datumFilter = isHeute ? todayStr : isGestern ? yesterdayStr : null;

  // Find mentioned month
  const monatMatch = MONTHS.find(m => f.includes(m.toLowerCase()));

  // Helper: get deals for month or date
  const getMonat = (m: string) => deals.filter(d => d.monat.startsWith(m));
  const getDatum = (datum: string) => deals.filter(d => d.datum === datum);

  // Top Partner/Projekt question
  if ((f.includes("top") || f.includes("best")) && (f.includes("partner") || f.includes("projekt") || f.includes("kunde"))) {
    const src = datumFilter ? getDatum(datumFilter) : monatMatch ? getMonat(monatMatch) : deals;
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    const partnerMap: Record<string,{vol:number,cash:number,total:number,deals:number}> = {};
    src.forEach(d => {
      if (!partnerMap[d.partner]) partnerMap[d.partner]={vol:0,cash:0,total:0,deals:0};
      partnerMap[d.partner].vol += d.scgVol;
      partnerMap[d.partner].cash += d.scgCash;
      partnerMap[d.partner].total += d.total;
      partnerMap[d.partner].deals += 1;
    });
    const sorted = Object.entries(partnerMap).sort((a,b)=>b[1].vol-a[1].vol).slice(0,5);
    if (sorted.length===0) return `Keine Partner-Daten ${label} gefunden.`;
    return `🏆 Top Partner ${label} (nach SCG Volumen):\n\n${sorted.map(([p,v],i)=>`${i+1}. ${p}\n   SCG Volumen: ${fmt(v.vol)}\n   SCG Cash IN: ${fmt(v.cash)}\n   Deals: ${v.deals}`).join("\n\n")}`;
  }

  // Top Closer question
  if (f.includes("top") && (f.includes("closer") || f.includes("setter"))) {
    const src = datumFilter ? getDatum(datumFilter) : monatMatch ? getMonat(monatMatch) : deals;
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    const SETTERS = ["Montano","Cem","Yves","Mert","Kada","Sören","Rene","Daniel","Petrit","Henrik"];
    // Internal closers with provision
    const internStats = SETTERS.map(name => {
      const key = name==="Sören"?"soeren":name.toLowerCase();
      const relevant = src.filter(d=>{const v=(d as Record<string,unknown>)[key];return isInternCloser(d.setter)&&typeof v==="number"&&v>0;});
      const scgVol = relevant.reduce((a,d)=>a+d.scgVol,0);
      const scgCash = relevant.reduce((a,d)=>a+d.scgCash,0);
      return {name, scgVol, scgCash, cnt:relevant.length};
    }).filter(s=>s.cnt>0);
    // All closers by SCG Vol
    const allCloserMap: Record<string,{scgVol:number,scgCash:number,cnt:number}> = {};
    src.forEach(d=>{
      const name=(d.setter||"").trim();
      if(!name) return;
      if(!allCloserMap[name]) allCloserMap[name]={scgVol:0,scgCash:0,cnt:0};
      allCloserMap[name].scgVol+=d.scgVol;
      allCloserMap[name].scgCash+=d.scgCash;
      allCloserMap[name].cnt+=1;
    });
    const stats = Object.entries(allCloserMap).sort((a,b)=>b[1].scgVol-a[1].scgVol);
    if (stats.length===0) return `Keine Closer-Daten ${label} gefunden.`;
    return `🏆 Top-Closer ${label} (nach SCG Volumen):\n\n${stats.map(([name,s],i)=>`${i+1}. ${name}\n   SCG Volumen: ${fmt(s.scgVol)}\n   SCG Cash IN: ${fmt(s.scgCash)}\n   Deals: ${s.cnt}`).join("\n\n")}`;
  }

  // Month comparison
  if (f.includes("vergleich") || (f.includes("vs") || f.includes("gegen"))) {
    const found = MONTHS.filter(m => f.includes(m.toLowerCase()));
    if (found.length >= 2) {
      const [m1, m2] = found;
      const d1 = getMonat(m1); const d2 = getMonat(m2);
      const cash1 = d1.reduce((a,d)=>a+d.scgCash,0);
      const cash2 = d2.reduce((a,d)=>a+d.scgCash,0);
      const vol1 = d1.reduce((a,d)=>a+d.scgVol,0);
      const vol2 = d2.reduce((a,d)=>a+d.scgVol,0);
      const diff = cash2-cash1;
      return `📊 Vergleich ${m1} vs ${m2}:\n\n${m1}:\n  Deals: ${d1.length}\n  SCG Volumen: ${fmt(vol1)}\n  SCG Cash IN: ${fmt(cash1)}\n\n${m2}:\n  Deals: ${d2.length}\n  SCG Volumen: ${fmt(vol2)}\n  SCG Cash IN: ${fmt(cash2)}\n\nUnterschied Cash IN: ${diff>=0?"+":""}${fmt(diff)}`;
    }
  }

  // Partner question
  const partnerNames = [...new Set(deals.map(d=>d.partner))];
  const partnerMatch = partnerNames.find(p => f.includes(p.toLowerCase()));
  if (partnerMatch) {
    const src = datumFilter ? getDatum(datumFilter).filter(d=>d.partner===partnerMatch) : monatMatch ? getMonat(monatMatch).filter(d=>d.partner===partnerMatch) : deals.filter(d=>d.partner===partnerMatch);
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    if (src.length===0) return `Keine Daten für ${partnerMatch} ${label}.`;
    const vol = src.reduce((a,d)=>a+d.scgVol,0);
    const cash = src.reduce((a,d)=>a+d.scgCash,0);
    const total = src.reduce((a,d)=>a+d.total,0);
    const netto = src.reduce((a,d)=>a+d.scgCash-d.montano-d.cem-d.yves-d.mert-d.kada-d.soeren-d.rene,0);
    return `📋 ${partnerMatch} ${label}:\n\n  Deals: ${src.length}\n  Total: ${fmt(total)}\n  SCG Volumen: ${fmt(vol)}\n  SCG Cash IN: ${fmt(cash)}\n  Netto Cash-IN: ${fmt(netto)}`;
  }

  // Heute/Gestern overview
  if (datumFilter) {
    const src = getDatum(datumFilter);
    const label = isHeute ? "heute" : "gestern";
    if (src.length===0) return `Keine Deals ${label} (${datumFilter}) gefunden.`;
    const vol = src.reduce((a,d)=>a+d.scgVol,0);
    const cash = src.reduce((a,d)=>a+d.scgCash,0);
    const setter = ["montano","cem","yves","mert","kada","soeren","rene"];
    const setterSum = src.reduce((a,d)=>a+setter.reduce((b,s)=>{const v=(d as Record<string,unknown>)[s];return b+(typeof v==="number"?v:0);},0),0);
    const intern = src.filter(d=>d.intern);
    const extern = src.filter(d=>!d.intern);
    return `📅 ${label} (${datumFilter}):\n\n  Deals: ${src.length}\n  SCG Volumen: ${fmt(vol)}\n  SCG Cash IN: ${fmt(cash)}\n  Setter Provision: ${fmt(setterSum)}\n  Netto Cash-IN: ${fmt(cash-setterSum)}\n\n  Intern: ${intern.length} Deals | ${fmt(intern.reduce((a,d)=>a+d.scgCash,0))}\n  Extern: ${extern.length} Deals | ${fmt(extern.reduce((a,d)=>a+d.scgCash,0))}`;
  }

  // Month overview
  if (monatMatch) {
    const src = getMonat(monatMatch);
    if (src.length===0) return `Keine Daten für ${monatMatch} gefunden.`;
    const vol = src.reduce((a,d)=>a+d.scgVol,0);
    const cash = src.reduce((a,d)=>a+d.scgCash,0);
    const setter = ["montano","cem","yves","mert","kada","soeren","rene"];
    const setterSum = src.reduce((a,d)=>a+setter.reduce((b,s)=>{const v=(d as Record<string,unknown>)[s];return b+(typeof v==="number"?v:0);},0),0);
    const intern = src.filter(d=>d.intern);
    const extern = src.filter(d=>!d.intern);
    return `📅 ${monatMatch} Übersicht:\n\n  Deals: ${src.length}\n  SCG Volumen: ${fmt(vol)}\n  SCG Cash IN: ${fmt(cash)}\n  Setter Provision: ${fmt(setterSum)}\n  Netto Cash-IN: ${fmt(cash-setterSum)}\n\n  Intern: ${intern.length} Deals | ${fmt(intern.reduce((a,d)=>a+d.scgCash,0))}\n  Extern: ${extern.length} Deals | ${fmt(extern.reduce((a,d)=>a+d.scgCash,0))}`;
  }

  // How many deals
  if (f.includes("wie viel") && f.includes("deal") || f.includes("wieviel deal") || f.includes("anzahl deal")) {
    const src = datumFilter ? getDatum(datumFilter) : monatMatch ? getMonat(monatMatch) : deals;
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    const intern = src.filter(d=>d.intern).length;
    const extern = src.filter(d=>!d.intern).length;
    return `📊 Deals ${label}:\n\n  Gesamt: ${src.length}\n  Intern: ${intern}\n  Extern: ${extern}`;
  }

  // Umsatz / Revenue question
  if (f.includes("umsatz") || f.includes("revenue") || f.includes("einnahmen")) {
    const src = datumFilter ? getDatum(datumFilter) : monatMatch ? getMonat(monatMatch) : deals;
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    const vol = src.reduce((a,d)=>a+d.scgVol,0);
    const cash = src.reduce((a,d)=>a+d.scgCash,0);
    const total = src.reduce((a,d)=>a+d.total,0);
    const setter = ["montano","cem","yves","mert","kada","soeren","rene"];
    const setterSum = src.reduce((a,d)=>a+setter.reduce((b,s)=>{const v=(d as Record<string,unknown>)[s];return b+(typeof v==="number"?v:0);},0),0);
    return `💰 Umsatz ${label}:\n\n  Total (Partner): ${fmt(total)}\n  SCG Volumen: ${fmt(vol)}\n  SCG Cash IN: ${fmt(cash)}\n  Setter Provision: ${fmt(setterSum)}\n  Netto Cash-IN: ${fmt(cash-setterSum)}`;
  }

  // Intern/Extern split
  if (f.includes("intern") || f.includes("extern")) {
    const src = datumFilter ? getDatum(datumFilter) : monatMatch ? getMonat(monatMatch) : deals;
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    const intern = src.filter(d=>d.intern);
    const extern = src.filter(d=>!d.intern);
    const iVol = intern.reduce((a,d)=>a+d.internVol,0);
    const iCash = intern.reduce((a,d)=>a+d.internCash,0);
    const eVol = extern.reduce((a,d)=>a+d.externVol,0);
    const eCash = extern.reduce((a,d)=>a+d.externCash,0);
    return `📊 Intern vs Extern ${label}:\n\nINTERN (${intern.length} Deals):\n  Volumen: ${fmt(iVol)}\n  Cash IN: ${fmt(iCash)}\n\nEXTERN (${extern.length} Deals):\n  Volumen: ${fmt(eVol)}\n  Cash IN: ${fmt(eCash)}`;
  }

  // Netto question
  if (f.includes("netto")) {
    const src = datumFilter ? getDatum(datumFilter) : monatMatch ? getMonat(monatMatch) : deals;
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    const cash = src.reduce((a,d)=>a+d.scgCash,0);
    const setter = ["montano","cem","yves","mert","kada","soeren","rene"];
    const setterSum = src.reduce((a,d)=>a+setter.reduce((b,s)=>{const v=(d as Record<string,unknown>)[s];return b+(typeof v==="number"?v:0);},0),0);
    return `💚 Netto Cash-IN ${label}:\n\n  SCG Cash IN: ${fmt(cash)}\n  Setter Provision: - ${fmt(setterSum)}\n  ─────────────────\n  Netto: ${fmt(cash-setterSum)}`;
  }

  // Diese Woche / Letzte Woche
  if (f.includes("diese woche") || f.includes("letzte woche") || f.includes("diese woche")) {
    const now = new Date();
    const dow = now.getDay();
    const monday = new Date(now); monday.setDate(now.getDate() - (dow===0?6:dow-1));
    const isLetzte = f.includes("letzte");
    if (isLetzte) monday.setDate(monday.getDate()-7);
    const sunday = new Date(monday); sunday.setDate(monday.getDate()+6);
    const pad = (n:number) => String(n).padStart(2,'0');
    const fmt2 = (d:Date) => `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}`;
    const weekDates: string[] = [];
    const cur = new Date(monday);
    while (cur <= sunday) { weekDates.push(fmt2(cur)); cur.setDate(cur.getDate()+1); }
    const src = deals.filter(d=>weekDates.includes(d.datum));
    const label = isLetzte ? "letzte Woche" : "diese Woche";
    const ws = `${pad(monday.getDate())}.${pad(monday.getMonth()+1)}`;
    const we = `${pad(sunday.getDate())}.${pad(sunday.getMonth()+1)}`;
    if (src.length===0) return `Keine Deals ${label} (${ws}–${we}) gefunden.`;
    const vol = src.reduce((a,d)=>a+d.scgVol,0);
    const cash = src.reduce((a,d)=>a+d.scgCash,0);
    const setter = ["montano","cem","yves","mert","kada","soeren","rene"];
    const setterSum = src.reduce((a,d)=>a+setter.reduce((b,s)=>{const v=(d as Record<string,unknown>)[s];return b+(typeof v==="number"?v:0);},0),0);
    return `📅 ${label} (${ws} – ${we}):\n\n  Deals: ${src.length}\n  SCG Volumen: ${fmt(vol)}\n  SCG Cash IN: ${fmt(cash)}\n  Setter Provision: ${fmt(setterSum)}\n  Netto Cash-IN: ${fmt(cash-setterSum)}`;
  }

  // Vergleich diese Woche mit letzter Woche
  if ((f.includes("vergleich") || f.includes("vs")) && (f.includes("woche") || f.includes("kw"))) {
    const now = new Date();
    const dow = now.getDay();
    const monday = new Date(now); monday.setDate(now.getDate() - (dow===0?6:dow-1));
    const lastMonday = new Date(monday); lastMonday.setDate(monday.getDate()-7);
    const pad = (n:number) => String(n).padStart(2,'0');
    const fmt2 = (d:Date) => `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}`;
    const getWeekDates = (start: Date) => { const dates=[]; const c=new Date(start); for(let i=0;i<7;i++){dates.push(fmt2(c));c.setDate(c.getDate()+1);} return dates; };
    const thisWeekDeals = deals.filter(d=>getWeekDates(monday).includes(d.datum));
    const lastWeekDeals = deals.filter(d=>getWeekDates(lastMonday).includes(d.datum));
    const cash1 = lastWeekDeals.reduce((a,d)=>a+d.scgCash,0);
    const cash2 = thisWeekDeals.reduce((a,d)=>a+d.scgCash,0);
    const vol1 = lastWeekDeals.reduce((a,d)=>a+d.scgVol,0);
    const vol2 = thisWeekDeals.reduce((a,d)=>a+d.scgVol,0);
    const diff = cash2-cash1;
    return `📊 Vergleich Woche:\n\nLetzte Woche:\n  Deals: ${lastWeekDeals.length}\n  SCG Cash IN: ${fmt(cash1)}\n  SCG Volumen: ${fmt(vol1)}\n\nDiese Woche:\n  Deals: ${thisWeekDeals.length}\n  SCG Cash IN: ${fmt(cash2)}\n  SCG Volumen: ${fmt(vol2)}\n\nUnterschied: ${diff>=0?"+":""}${fmt(diff)}`;
  }

  // Bester Tag
  if ((f.includes("bester tag") || f.includes("besten tag")) ) {
    const src = monatMatch ? getMonat(monatMatch) : deals;
    const label = monatMatch ? `im ${monatMatch}` : "gesamt";
    const byDay: Record<string,number> = {};
    src.forEach(d=>{ byDay[d.datum]=(byDay[d.datum]||0)+d.scgCash; });
    const sorted = Object.entries(byDay).sort((a,b)=>b[1]-a[1]);
    if (sorted.length===0) return `Keine Daten ${label}.`;
    return `🏆 Bester Tag ${label}:\n\n${sorted.slice(0,5).map(([d,v],i)=>`${i+1}. ${d}: ${fmt(v)}`).join("\n")}`;
  }

  // Durchschnitt pro Deal
  if (f.includes("durchschnitt")) {
    const src = datumFilter ? getDatum(datumFilter) : monatMatch ? getMonat(monatMatch) : deals;
    const label = datumFilter ? (isHeute?"heute":"gestern") : monatMatch ? `im ${monatMatch}` : "gesamt";
    if (src.length===0) return `Keine Daten ${label}.`;
    const avgVol = src.reduce((a,d)=>a+d.scgVol,0)/src.length;
    const avgCash = src.reduce((a,d)=>a+d.scgCash,0)/src.length;
    const avgTotal = src.reduce((a,d)=>a+d.total,0)/src.length;
    return `📊 Durchschnitt pro Deal ${label}:\n\n  Deals gesamt: ${src.length}\n  Ø Total: ${fmt(avgTotal)}\n  Ø SCG Volumen: ${fmt(avgVol)}\n  Ø SCG Cash IN: ${fmt(avgCash)}`;
  }

  // Wie viel fehlt bis Ziel
  if (f.includes("fehlt") || f.includes("ziel")) {
    const monat = monatMatch || "Mai";
    const src = getMonat(monat);
    const cash = src.reduce((a,d)=>a+d.scgCash,0);
    const zielMatch = frage.match(/(\d[\d.,]+)/);
    if (zielMatch) {
      const ziel = parseFloat(zielMatch[1].replace(/\./g,"").replace(",","."));
      const fehlt = ziel - cash;
      return `🎯 Ziel-Tracking ${monat}:\n\n  Aktuell: ${fmt(cash)}\n  Ziel: ${fmt(ziel)}\n  ${fehlt>0?`Fehlt noch: ${fmt(fehlt)}`:`Ziel erreicht! +${fmt(Math.abs(fehlt))}`}`;
    }
    return `Bitte nenn ein Ziel, z.B. "Wie viel fehlt bis 100.000 im Mai?"`;
  }

  // Meiste Deals Partner
  if (f.includes("meisten deals") || f.includes("meiste deals")) {
    const src = monatMatch ? getMonat(monatMatch) : deals;
    const label = monatMatch ? `im ${monatMatch}` : "gesamt";
    const pm: Record<string,number> = {};
    src.forEach(d=>{ pm[d.partner]=(pm[d.partner]||0)+1; });
    const sorted = Object.entries(pm).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return `🏆 Meiste Deals ${label}:\n\n${sorted.map(([p,n],i)=>`${i+1}. ${p}: ${n} Deals`).join("\n")}`;
  }

  // Best month
  if (f.includes("besten") || f.includes("höchsten") || f.includes("meisten")) {
    const byMonth = MONTHS.map(m => {
      const src = getMonat(m);
      return {m, cash: src.reduce((a,d)=>a+d.scgCash,0), deals: src.length};
    }).filter(x=>x.deals>0).sort((a,b)=>b.cash-a.cash);
    if (byMonth.length===0) return "Keine Daten gefunden.";
    const best = byMonth[0];
    return `🏆 Bester Monat: ${best.m}\n\n  SCG Cash IN: ${fmt(best.cash)}\n  Deals: ${best.deals}\n\nAlle Monate:\n${byMonth.map((x,i)=>`${i+1}. ${x.m}: ${fmt(x.cash)} (${x.deals} Deals)`).join("\n")}`;
  }

  // General overview
  if (f.includes("übersicht") || f.includes("gesamt") || f.includes("total") || f.includes("zusammenfassung")) {
    const vol = deals.reduce((a,d)=>a+d.scgVol,0);
    const cash = deals.reduce((a,d)=>a+d.scgCash,0);
    const setter = ["montano","cem","yves","mert","kada","soeren","rene"];
    const setterSum = deals.reduce((a,d)=>a+setter.reduce((b,s)=>{const v=(d as Record<string,unknown>)[s];return b+(typeof v==="number"?v:0);},0),0);
    return `📊 Gesamtübersicht 2026:\n\n  Deals: ${deals.length}\n  SCG Volumen: ${fmt(vol)}\n  SCG Cash IN: ${fmt(cash)}\n  Setter Provision: ${fmt(setterSum)}\n  Netto Cash-IN: ${fmt(cash-setterSum)}\n\nMonate:\n${MONTHS.map(m=>{const s=getMonat(m);const c=s.reduce((a,d)=>a+d.scgCash,0);return s.length?`  ${m}: ${fmt(c)} (${s.length} Deals)`:null;}).filter(Boolean).join("\n")}`;
  }

  return `Ich kann dir bei folgenden Fragen helfen:\n\n📅 ZEIT\n• "Wie war heute?" / "Wie war gestern?"\n• "Wie war diese Woche?" / "Wie war letzte Woche?"\n• "Wie war der [Monat]?"\n• "Vergleiche diese Woche mit letzter Woche"\n• "Vergleiche [Monat1] mit [Monat2]"\n\n🏆 RANKING\n• "Wer ist Top-Closer heute?"\n• "Wer ist Top-Partner heute?"\n• "Welcher Monat war am besten?"\n• "Bester Tag im [Monat]?"\n• "Wer hat die meisten Deals im [Monat]?"\n\n💰 ZAHLEN\n• "Umsatz heute" / "Umsatz im [Monat]"\n• "Netto heute" / "Netto im [Monat]"\n• "Wie viel Deals heute?"\n• "Durchschnitt pro Deal im [Monat]"\n• "Wie viel fehlt bis 100.000 im Mai?"\n\n🏢 PARTNER\n• "Wie viel hat [Partner] gemacht?"\n• "Intern vs Extern heute"\n\n📊 ÜBERSICHT\n• "Gesamtübersicht"`;
}

// ============================================================
// FIRMEN DASHBOARD
// ============================================================

type Buchung = {datum:string; name:string; betrag:number; kategorie:string; firma:string;};

const FIRMEN_DATEN: Buchung[] = [
  // HH Sales Consulting Germany GmbH - Einnahmen
  ...[
    ["01.04.2026","No Limits Consulting GmbH Miete",1706.98],["01.04.2026","Allianz Rückgabe Kfz",3649.71],
    ["02.04.2026","Everflow Excellence GmbH",16755.20],["07.04.2026","Eitel Invest AG 2026-86",10376.66],
    ["07.04.2026","Eitel Invest AG 2026-84",6000.00],["07.04.2026","enercity AG",101.73],
    ["09.04.2026","Grundl Leadership Institut",35394.78],["10.04.2026","Schippke + Partner",39214.00],
    ["10.04.2026","ECOM HOUSE GmbH",5355.00],["13.04.2026","enercity AG",295.00],["13.04.2026","enercity AG",18.00],
    ["14.04.2026","medien.com Temmer Bansal",750.00],["14.04.2026","HEALING HUMANS GMBH",1069.74],
    ["14.04.2026","ECOM HOUSE GmbH 2",81678.04],["15.04.2026","Arlind Nuhi",5623.87],
    ["15.04.2026","SocialNatives GmbH",2659.65],["17.04.2026","Candidate Flow GmbH",94076.72],
    ["20.04.2026","AIRWALLEX",1916.95],["27.04.2026","Commerzbank DB",197.80],
    ["27.04.2026","AOK BW Erstattung",120.00],["27.04.2026","AOK BW Erstattung 2",116.13],
    ["28.04.2026","Hamann + Kollegen 1",9972.85],["28.04.2026","Hamann + Kollegen 2",9000.00],
    ["28.04.2026","Hamann + Kollegen 3",5000.00],["28.04.2026","2B AHEAD THINKTANK",36248.74],
    ["28.04.2026","Commerzbank CLAUDE.AI",21.74],
  ].map(([d,n,b]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:"Einnahmen",firma:"HH Sales Consulting Germany GmbH"})),
  // HH Sales - Ausgaben
  ...[
    ["01.04.2026","Allianz Kfz-Versicherung",-2068.45,"Autoversicherung"],["01.04.2026","Lebensversicherung 1",-676.00,"Lebensversicherung"],
    ["01.04.2026","Lebensversicherung 2",-676.00,"Lebensversicherung"],["01.04.2026","ARAG Rechtsschutz",-267.17,"Versicherung"],
    ["01.04.2026","Webflow",-30.56,"Software"],["01.04.2026","Henrik Rückerstattung",-1579.41,"Reisekosten"],
    ["02.04.2026","flaschenpost",-123.43,"Sonstiges"],["02.04.2026","Arbnor DB Bahn",-63.00,"Reisekosten"],
    ["02.04.2026","Recruitee",-321.30,"Software"],["07.04.2026","easybill",-20.23,"Software"],
    ["07.04.2026","Porsche Leasing 1",-3872.92,"Leasing"],["07.04.2026","Porsche Leasing 2",-5691.83,"Leasing"],
    ["07.04.2026","Google Workspace",-207.05,"Software"],["07.04.2026","Google Workspace 2",-16.20,"Software"],
    ["07.04.2026","Google Workspace 3",-60.75,"Software"],["07.04.2026","STITCHDATA",-87.75,"Software"],
    ["07.04.2026","Google CLOUD",-27.50,"Software"],["07.04.2026","Google Workspace 4",-29.40,"Software"],
    ["07.04.2026","Tankstelle Lehrte",-115.32,"Tankstelle"],["07.04.2026","Miete Büro",-12484.16,"Miete"],
    ["07.04.2026","enercity Strom",-313.00,"Strom"],["08.04.2026","SLACK",-66.19,"Software"],
    ["08.04.2026","Cem Fahrtkosten",-225.90,"Reisekosten"],["09.04.2026","Markel Insurance",-1079.57,"Versicherung"],
    ["09.04.2026","Stefan Michalea",-3332.00,"Dienstleistung"],["09.04.2026","enercity 2",-27.26,"Strom"],
    ["10.04.2026","CLOSE CRM",-43.56,"Software"],["13.04.2026","monday.com",-144.94,"Software"],
    ["13.04.2026","ZOOM",-207.99,"Software"],["13.04.2026","HEM Tankstelle",-110.22,"Tankstelle"],
    ["13.04.2026","CALENDLY",-193.26,"Software"],["13.04.2026","IONOS",-511.80,"Software"],
    ["13.04.2026","Henrik Hotel",-1355.00,"Reisekosten"],["13.04.2026","Skalator Barwary",-5593.00,"Dienstleistung"],
    ["13.04.2026","Stefan Michalea 2",-10710.00,"Dienstleistung"],["14.04.2026","Telekom",-139.05,"Telekommunikation"],
    ["14.04.2026","ANTHROPIC",-46.20,"Software"],["14.04.2026","Collection Business",-8987.12,"Miete"],
    ["15.04.2026","Finanzamt USt",-38216.89,"Finanzamt"],["15.04.2026","ZAPIER",-190.82,"Software"],
    ["15.04.2026","CLOSE CRM 2",-34.86,"Software"],["15.04.2026","PINEAPPLE CONSULT",-1500.00,"Dienstleistung"],
    ["15.04.2026","BD Berlin Tax",-107.10,"Steuerberatung"],["15.04.2026","Arbnor Restaurant",-114.40,"Reisekosten"],
    ["16.04.2026","Finanzamt Lohnst",-21804.60,"Finanzamt"],["16.04.2026","CLAUDE.AI 1",-21.74,"Software"],
    ["16.04.2026","CLOSE CRM 3",-59.00,"Software"],["16.04.2026","CLAUDE.AI 2",-21.74,"Software"],
    ["16.04.2026","HP Venius Dubai",-49169.05,"Auslandsüberweisung"],["17.04.2026","CLAUDE.AI 3",-21.42,"Software"],
    ["17.04.2026","ZOOM 2",-32.66,"Software"],["17.04.2026","BD Berlin Tax 2",-575.96,"Steuerberatung"],
    ["20.04.2026","flaschenpost 2",-163.60,"Sonstiges"],["20.04.2026","BKK Debeka",-1461.72,"Krankenkasse"],
    ["20.04.2026","AOK NordWest",-3187.08,"Krankenkasse"],["20.04.2026","R+V BKK",-1373.10,"Krankenkasse"],
    ["20.04.2026","EK Hanseatische KK",-5980.62,"Krankenkasse"],["20.04.2026","AOK Gesundheitskasse",-10508.02,"Krankenkasse"],
    ["20.04.2026","AOK BW KK",-1382.40,"Krankenkasse"],["20.04.2026","Deutsche Rentenvers.",-1818.80,"Krankenkasse"],
    ["20.04.2026","TK",-1361.40,"Krankenkasse"],["20.04.2026","hkk",-1805.60,"Krankenkasse"],
    ["20.04.2026","Aral",-104.02,"Tankstelle"],["20.04.2026","ZOOM 3",-16.34,"Software"],
    ["20.04.2026","CLOSE CRM 4",-385.64,"Software"],["20.04.2026","Elektro Schwichow",-70.02,"Sonstiges"],
    ["20.04.2026","Cem Lohn",-5901.50,"Lohn"],["20.04.2026","Daniel Lohn",-2586.09,"Lohn"],
    ["20.04.2026","Rene Lohn",-4505.25,"Lohn"],["20.04.2026","Yves Lohn",-3557.17,"Lohn"],
    ["20.04.2026","Semir Lohn",-2053.55,"Lohn"],["20.04.2026","Melih Mert Lohn",-4466.51,"Lohn"],
    ["20.04.2026","Dinh Huy Lohn",-3640.08,"Lohn"],["20.04.2026","Fatmire Lohn",-1732.47,"Lohn"],
    ["20.04.2026","Montano Lohn",-8598.35,"Lohn"],["20.04.2026","Sören Lohn",-2609.79,"Lohn"],
    ["20.04.2026","Donika Lohn",-2277.94,"Lohn"],["20.04.2026","Arbnor Lohn",-5459.78,"Lohn"],
    ["20.04.2026","Henrik Lohn",-19604.91,"Lohn"],["20.04.2026","Jose Leonardo Lohn",-2030.29,"Lohn"],
    ["20.04.2026","Adrian Kurtesi Lohn",-2053.49,"Lohn"],["20.04.2026","Yannick Koch Lohn",-2047.99,"Lohn"],
    ["21.04.2026","Telekom 2",-3.94,"Telekommunikation"],["22.04.2026","Allianz H-PL 604",-2986.80,"Autoversicherung"],
    ["22.04.2026","VIMEO",-37.44,"Software"],["23.04.2026","Kfz-Steuer",-592.00,"Steuer"],
    ["23.04.2026","Booking.com",-244.98,"Reisekosten"],["23.04.2026","DB Bahn 1",-47.99,"Reisekosten"],
    ["23.04.2026","DB Bahn 2",-108.49,"Reisekosten"],["23.04.2026","OneCal",-51.91,"Software"],
    ["23.04.2026","DB Bahn 3",-156.68,"Reisekosten"],["24.04.2026","JotForm",-47.11,"Software"],
    ["27.04.2026","Telekom Mobil",-71.34,"Telekommunikation"],["27.04.2026","DB Bahn 4",-73.69,"Reisekosten"],
    ["27.04.2026","CLAUDE.AI 4",-21.74,"Software"],["27.04.2026","CLAUDE.AI 5",-91.38,"Software"],
    ["27.04.2026","DB Bahn 5",-168.49,"Reisekosten"],["27.04.2026","DB Bahn 6",-61.99,"Reisekosten"],
    ["27.04.2026","DB Bahn 7",-203.30,"Reisekosten"],["27.04.2026","ATLASSIAN",-55.88,"Software"],
    ["27.04.2026","COOKIEBOT",-8.33,"Software"],["27.04.2026","Hotel Booking",-159.29,"Reisekosten"],
    ["27.04.2026","JUMPSHARE",-26.09,"Software"],["27.04.2026","HEM Tankstelle 2",-96.30,"Tankstelle"],
    ["27.04.2026","Stadtmauer Restaurant",-69.80,"Reisekosten"],["27.04.2026","Vodafone",-80.18,"Telekommunikation"],
    ["27.04.2026","Moritz Winter",-4165.00,"Dienstleistung"],["28.04.2026","Semir Taxi",-55.00,"Reisekosten"],
    ["28.04.2026","Henrik App Store",-5247.90,"Sonstiges"],["29.04.2026","HOSTINGER",-20.81,"Software"],
    ["29.04.2026","CLAUDE.AI 6",-21.74,"Software"],["29.04.2026","Mercedes Leasing",-2089.08,"Leasing"],
    ["29.04.2026","VW Leasing",-1479.17,"Leasing"],["30.04.2026","CLAUDE.AI 7",-21.74,"Software"],
    ["30.04.2026","Recruitee 2",-321.30,"Software"],["30.04.2026","Kontoführung",-57.90,"Bank"],
  ].map(([d,n,b,k]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:k as string,firma:"HH Sales Consulting Germany GmbH"})),
  // Peak Revenue AG - Einnahmen (CHF)
  ...[
    ["23.03.2026","Aktienkapitaleinzahlung",99875.00],["14.04.2026","Investmentpunk",3093.70],
    ["17.04.2026","Leon Ioakeim",4555.39],["30.04.2026","Tax Angels Sebastian Engel",10810.00],
  ].map(([d,n,b]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:"Einnahmen",firma:"Peak Revenue AG"})),
  // Peak Revenue AG - Ausgaben (CHF)
  ...[
    ["07.04.2026","Kapitaleinlage Hamann & Kollegen",-23320.88,"Kapitaleinlage"],
    ["13.04.2026","Kanton Nidwalden Steuern",-590.00,"Steuer"],
    ["14.04.2026","Steckel Legal & Tax",-9080.40,"Steuerberatung"],
    ["22.04.2026","SLACK",-20.79,"Software"],["23.04.2026","NORDINA HOME",-159.00,"Sonstiges"],
    ["24.04.2026","Fechner Rechtsanwälte",-781.57,"Rechtsberatung"],
    ["24.04.2026","LOVABLE",-23.27,"Software"],["24.04.2026","PERPLEXITY.AI",-170.74,"Software"],
    ["24.04.2026","AIRTABLE",-19.02,"Software"],["24.04.2026","N8N",-60.38,"Software"],
    ["24.04.2026","FIGMA",-17.13,"Software"],["24.04.2026","MANUS AI",-34.27,"Software"],
    ["24.04.2026","Reviso Treuhand",-1081.00,"Steuerberatung"],["29.04.2026","OPENAI",-25.86,"Software"],
    ["29.04.2026","IKEA",-942.90,"Sonstiges"],["29.04.2026","HOSTINGER",-10.08,"Software"],
    ["29.04.2026","Zahlungsverkehrspreise",-24.00,"Bank"],
  ].map(([d,n,b,k]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:k as string,firma:"Peak Revenue AG"})),
  // HP Venius - Einnahmen (€)
  ...[
    ["09.04.2026","CopeCart",3518.18],["03.04.2026","NIKO DIECKHOFF FZCO",252.74],
    ["16.04.2026","M S V T MARKETING MANAGEMENT",15724.73],["17.04.2026","HH Sales Consulting Germany GmbH",49019.49],
  ].map(([d,n,b]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:"Einnahmen",firma:"HP Venius"})),
  // HP Venius - Ausgaben
  ...[
    ["03.04.2026","Bankgebühren",-72.19,"Bankgebühren"],["03.04.2026","VAT Bankgebühren",-3.61,"Bankgebühren"],
    ["17.04.2026","Transfer DTB",-1605.00,"Überweisung"],["23.04.2026","Samuel Greif Lohn",-0.24,"Lohn"],
    ["23.04.2026","Florian Schimpf Lohn",-2400.00,"Lohn"],["23.04.2026","Taim Shakir Lohn",-3600.00,"Lohn"],
    ["23.04.2026","Lukas Jukic Lohn",-4370.00,"Lohn"],["23.04.2026","Sülei Tatli Lohn",-54480.00,"Lohn"],
    ["23.04.2026","FTA Tax Payment",-3021.50,"Steuer"],["23.04.2026","Transfer DTB 2",-461.48,"Überweisung"],
  ].map(([d,n,b,k]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:k as string,firma:"HP Venius"})),
  // Hamann & Kollegen - Einnahmen
  ...[
    ["07.04.2026","Zahlung aus dem Ausland",25000.00],["27.04.2026","WHITE.IMMOBILIEN GMBH",48861.00],
  ].map(([d,n,b]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:"Einnahmen",firma:"Hamann & Kollegen Immobilien GmbH"})),
  // Hamann & Kollegen - Ausgaben
  ...[
    ["09.04.2026","KROOS I KOLLEGEN",-808.74,"Dienstleistung"],["15.04.2026","AMTSGERICHT HANNOVER",-300.00,"Gebühren"],
    ["22.04.2026","CLOSE CRM",-34.64,"Software"],["23.04.2026","CLOSE CRM 2",-116.39,"Software"],
    ["24.04.2026","WEBFLOW",-18.54,"Software"],["27.04.2026","FACEBK Ads 1",-20.00,"Marketing"],
    ["27.04.2026","FACEBK Ads 2",-20.00,"Marketing"],["27.04.2026","FACEBK Ads 3",-153.00,"Marketing"],
    ["27.04.2026","FACEBK Ads 4",-20.00,"Marketing"],["27.04.2026","FACEBK Ads 5",-153.00,"Marketing"],
    ["27.04.2026","FACEBK Ads 6",-20.00,"Marketing"],["27.04.2026","FACEBK Ads 7",-150.00,"Marketing"],
    ["27.04.2026","PIXELFLOW",-16.52,"Software"],["27.04.2026","HH SCG Ausgaben 1",-9972.85,"Dienstleistung"],
    ["27.04.2026","HH SCG Ausgaben 2",-9000.00,"Dienstleistung"],["27.04.2026","HH SCG Ausgaben 3",-5000.00,"Dienstleistung"],
  ].map(([d,n,b,k]) => ({datum:d as string,name:n as string,betrag:b as number,kategorie:k as string,firma:"Hamann & Kollegen Immobilien GmbH"})),
];

const FIRMEN_LIST = ["HH Sales Consulting Germany GmbH","Peak Revenue AG","HP Venius","Hamann & Kollegen Immobilien GmbH"];
const FIRMEN_COLORS: Record<string,string> = {
  "HH Sales Consulting Germany GmbH": "#818cf8",
  "Peak Revenue AG": "#34d399",
  "HP Venius": "#f59e0b",
  "Hamann & Kollegen Immobilien GmbH": "#f472b6",
};
const FIRMEN_SHORT: Record<string,string> = {
  "HH Sales Consulting Germany GmbH": "HH SCG",
  "Peak Revenue AG": "Peak Revenue",
  "HP Venius": "HP Venius",
  "Hamann & Kollegen Immobilien GmbH": "Hamann & Kollegen",
};


export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selDash, setSelDash] = useState<"sales"|"firmen">("sales");
  const [hydrated, setHydrated] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("hh_scg_auth");
    if (auth === "sales") { setSelDash("sales"); setLoggedIn(true); }
    else if (auth === "firmen") { setSelDash("firmen"); setLoggedIn(true); }
    setHydrated(true);
  }, []);

  function doLogin() {
    const pw = selDash === "firmen" ? PASSWORD2 : PASSWORD;
    if (pwInput === pw) {
      localStorage.setItem("hh_scg_auth", selDash);
      setLoggedIn(true);
    } else {
      setPwError(true);
      setPwInput("");
    }
  }

  const [selectedMonth, setSelectedMonth] = useState("Mai 2026");
  const [selectedDatum, setSelectedDatum] = useState("04.05.2026");
  const [activeTab, setActiveTab] = useState<"dashboard"|"tagesansicht"|"wochenansicht"|"monatsansicht"|"jahresuebersicht"|"closer_intern"|"closer_extern">("dashboard");
  const [uploadedDeals, setUploadedDeals] = useState<Deal[]|null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle"|"success"|"error">("idle");
  const [monthOpen, setMonthOpen] = useState(false);
  const [closerView, setCloserView] = useState<"monat"|"tag">("monat");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role:"user"|"assistant",content:string}[]>([]);

  async function sendChatMessage(msg: string) {
    if (!msg.trim() || chatLoading) return;
    setChatInput("");
    setChatLoading(true);
    const newMessages = [...chatMessages, {role:"user" as const, content:msg}];
    setChatMessages(newMessages);
    // Small delay for UX
    await new Promise(r => setTimeout(r, 400));
    try {
      const antwort = beantworteFrageLokal(msg, deals);
      setChatMessages([...newMessages, {role:"assistant", content:antwort}]);
    } catch {
      setChatMessages([...newMessages, {role:"assistant", content:"Fehler beim Verarbeiten der Frage."}]);
    }
    setChatLoading(false);
  }

  const deals = uploadedDeals ?? DEALS;

  useEffect(() => {
    async function fetchSheetData() {
      try {
        const text = await fetchSheet();
        console.log("Fetched CSV, length:", text.length, "first 200 chars:", text.substring(0, 200));
        const parsed = parseCSV(text);
        console.log("Parsed deals:", parsed.length, "first deal:", parsed[0]);
        if (parsed.length > 0) {
          setUploadedDeals(parsed);
          setUploadStatus("success");
        } else {
          console.error("No deals parsed from CSV!");
          setUploadStatus("error");
        }
      } catch(e) {
        console.error("Fetch error:", e);
        setUploadStatus("error");
      }
    }
    fetchSheetData();
    const interval = setInterval(fetchSheetData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const C = {
    bg:"#07070f", sidebar:"#0b0b15", card:"#0f0f1c", border:"#1c1c2e", border2:"#252538",
    indigo:"#818cf8", green:"#34d399", amber:"#f59e0b", pink:"#f472b6",
    cyan:"#67e8f9", text:"#e8e8f0", muted:"#52526a", dimmed:"#252540",
  };
  const TH: React.CSSProperties = {
    padding:"10px 16px", textAlign:"left", fontSize:11, color:C.muted,
    letterSpacing:"1.2px", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`,
    whiteSpace:"nowrap", background:"#08081a",
  };
  const TD: React.CSSProperties = { padding:"10px 16px", fontSize:13, whiteSpace:"nowrap" };
  const card = (accent?:string):React.CSSProperties => ({
    background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
    ...(accent?{borderTop:`2px solid ${accent}`}:{})
  });
  const mono = (color:string):React.CSSProperties => ({fontFamily:"'DM Mono',monospace",color});

  const dynamicMonths = useMemo(()=>{
    const mo = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    return [...new Set(deals.map(d=>d.monat))].sort((a,b)=>{
      const [am,ay]=a.split(" "); const [bm,by]=b.split(" ");
      return ay!==by?parseInt(ay)-parseInt(by):mo.indexOf(am)-mo.indexOf(bm);
    });
  },[deals]);

  const tageImMonat = useMemo(()=>[...new Set(deals.filter(d=>d.monat===selectedMonth).map(d=>d.datum))].sort(),[selectedMonth,deals]);

  const tagRows      = useMemo(()=>aggregate(deals.filter(d=>d.datum===selectedDatum)),[selectedDatum,deals]);
  const tagIntern    = useMemo(()=>{
    const filtered = deals.filter(d=>d.datum===selectedDatum&&isInternCloser(d.setter));
    console.log("Tag intern deals:", filtered.length, "setters:", [...new Set(filtered.map(d=>d.setter))]);
    console.log("All setters on date:", [...new Set(deals.filter(d=>d.datum===selectedDatum).map(d=>JSON.stringify(d.setter)))]);
    return aggregate(filtered);
  },[selectedDatum,deals]);
  const tagExtern    = useMemo(()=>aggregate(deals.filter(d=>d.datum===selectedDatum&&!isInternCloser(d.setter))),[selectedDatum,deals]);

  const monatsRows   = useMemo(()=>aggregate(deals.filter(d=>d.monat===selectedMonth)),[selectedMonth,deals]);
  const monatsIntern = useMemo(()=>aggregate(deals.filter(d=>d.monat===selectedMonth&&isInternCloser(d.setter))),[selectedMonth,deals]);
  const monatsExtern = useMemo(()=>aggregate(deals.filter(d=>d.monat===selectedMonth&&!isInternCloser(d.setter))),[selectedMonth,deals]);
  const jahresRows   = useMemo(()=>aggregate(deals),[deals]);

  if (!hydrated) return <div style={{minHeight:"100vh",background:"#07070f"}}/>;

  if (loggedIn && selDash === "firmen") return <FirmenDashboard onLogout={()=>{localStorage.removeItem("hh_scg_auth");setLoggedIn(false);setSelDash("sales");}}/>;

  if (!loggedIn) {
    return (
      <div style={{minHeight:"100vh",background:"#07070f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Inter',sans-serif"}}>
        <div style={{background:"#0f0f1c",border:"1px solid #1c1c2e",borderRadius:16,padding:"40px 48px",width:400,textAlign:"center"}}>
          <div style={{fontSize:24,fontWeight:800,color:"#fff",letterSpacing:"-0.5px"}}>HH SCG</div>
          <div style={{fontSize:11,color:"#52526a",letterSpacing:"3px",marginBottom:24}}>DASHBOARD</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
            <div onClick={()=>setSelDash("sales")} style={{padding:"14px",borderRadius:10,cursor:"pointer",textAlign:"center",
              background:selDash==="sales"?"#1e1e40":"#13132a",
              border:`2px solid ${selDash==="sales"?"#818cf8":"#252550"}`}}>
              <div style={{fontSize:20,marginBottom:6}}>📊</div>
              <div style={{fontSize:12,fontWeight:700,color:"#818cf8"}}>Sales Dashboard</div>
              <div style={{fontSize:10,color:"#52526a",marginTop:2}}>HH SCG Sales</div>
            </div>
            <div onClick={()=>setSelDash("firmen")} style={{padding:"14px",borderRadius:10,cursor:"pointer",textAlign:"center",
              background:selDash==="firmen"?"#0a2a10":"#0a1a10",
              border:`2px solid ${selDash==="firmen"?"#34d399":"#1a4a25"}`}}>
              <div style={{fontSize:20,marginBottom:6}}>🏢</div>
              <div style={{fontSize:12,fontWeight:700,color:"#34d399"}}>Jahresübersicht</div>
              <div style={{fontSize:10,color:"#52526a",marginTop:2}}>4 Firmen</div>
            </div>
          </div>
          {selDash && (
            <>
              <input
                type="password"
                placeholder={`Passwort für ${selDash==="sales"?"Sales Dashboard":"Jahresübersicht"}`}
                value={pwInput}
                onChange={e=>{setPwInput(e.target.value);setPwError(false);}}
                onKeyDown={e=>{if(e.key==="Enter") doLogin();}}
                style={{width:"100%",padding:"12px 16px",borderRadius:8,fontSize:14,
                  background:"#07070f",border:`1px solid ${pwError?"#f87171":"#252538"}`,
                  color:"#e8e8f0",outline:"none",boxSizing:"border-box",marginBottom:8}}
                autoFocus
              />
              {pwError && <div style={{color:"#f87171",fontSize:12,marginBottom:8}}>Falsches Passwort</div>}
              <button onClick={doLogin} style={{width:"100%",padding:"12px",borderRadius:8,fontSize:14,fontWeight:700,
                background:selDash==="sales"?"linear-gradient(135deg,#4f46e5,#818cf8)":"linear-gradient(135deg,#059669,#34d399)",
                color:"#fff",border:"none",cursor:"pointer",marginTop:4}}>
                Anmelden
              </button>
            </>
          )}
          {false && <div style={{fontSize:12,color:"#52526a"}}>Bitte Dashboard auswählen</div>}
        </div>
      </div>
    );
  }

  // computed below
  function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) { setUploadStatus("error"); return; }
        setUploadedDeals(parsed);
        // Set to latest month/date
        const months = [...new Set(parsed.map(d => d.monat))].sort((a,b) => {
          const mo = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
          const [am,ay] = a.split(" "); const [bm,by] = b.split(" ");
          return ay !== by ? parseInt(ay)-parseInt(by) : mo.indexOf(am)-mo.indexOf(bm);
        });
        const latestMonth = months[months.length-1];
        setSelectedMonth(latestMonth);
        const datesInMonth = [...new Set(parsed.filter(d=>d.monat===latestMonth).map(d=>d.datum))].sort();
        if (datesInMonth.length) setSelectedDatum(datesInMonth[datesInMonth.length-1]);
        setUploadStatus("success");
      } catch { setUploadStatus("error"); }
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  }



  function nettoSum(rows: PRow[]) {
    return rows.reduce((a,r) => a + nettoOf(r), 0);
  }

  function nettoFromDeals(ds: Deal[]) {
    return ds.reduce((a,d) => a + d.scgCash - d.montano - d.cem - d.yves - d.mert - d.kada - d.soeren - d.rene, 0);
  }

  function SumCard({label,vol,cash,netto,color,bg,border}:{label:string;vol:number;cash:number;netto?:number;color:string;bg:string;border:string}) {
    return(
      <div style={{background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"18px 22px"}}>
        <div style={{fontSize:10,color,textTransform:"uppercase",letterSpacing:"2px",marginBottom:14,fontWeight:700}}>{label}</div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>SCG Volumen</div><div style={{fontSize:17,fontWeight:700,...mono(color)}}>{fmt0(vol)}</div></div>
          <div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>Cash IN</div><div style={{fontSize:17,fontWeight:700,...mono(C.green)}}>{fmt0(cash)}</div></div>
          {netto!==undefined&&<div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>Netto</div><div style={{fontSize:17,fontWeight:700,...mono(C.amber)}}>{fmt0(netto)}</div></div>}
        </div>
      </div>
    );
  }

  function InternTable({rows,label}:{rows:PRow[];label:string}) {
    const sum=sumRows(rows);
    return(
      <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
        <div style={{padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/>
          <span style={{fontSize:13,fontWeight:700,color:C.green,letterSpacing:"1px"}}>INTERN</span>
          <span style={{fontSize:12,color:C.muted}}>{label}</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={TH}>Partner</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Total</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Erste Rate</th>
            <th style={{...TH,textAlign:"right",color:C.green}}>SUM von Intern Volumen</th>
            <th style={{...TH,textAlign:"right",color:C.cyan}}>SUM von Intern Cash IN</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.partner} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":"#0c0c1a"}}>
                <td style={{...TD,fontWeight:600,color:C.text}}>{r.partner}</td>
                <td style={{...TD,textAlign:"right",...mono(C.text)}}>{fmt(r.total)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.muted)}}>{fmt(r.ersteRate)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.green)}}>{fmt(r.internVol)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(r.internCash)}</td>
              </tr>
            ))}
            <tr style={{background:"#09091a",borderTop:`2px solid ${C.border2}`}}>
              <td style={{...TD,fontWeight:700,color:"#fff"}}>Gesamtsumme</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.text)}}>{fmt(sum.total)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.muted)}}>{fmt(sum.ersteRate)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.green)}}>{fmt(sum.internVol)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.cyan)}}>{fmt(sum.internCash)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function ExternTable({rows,label}:{rows:PRow[];label:string}) {
    const sum=sumRows(rows);
    return(
      <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
        <div style={{padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.pink}}/>
          <span style={{fontSize:13,fontWeight:700,color:C.pink,letterSpacing:"1px"}}>EXTERN</span>
          <span style={{fontSize:12,color:C.muted}}>{label}</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={TH}>Partner</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Total</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Erste Rate</th>
            <th style={{...TH,textAlign:"right",color:C.pink}}>SUM von Extern Volumen</th>
            <th style={{...TH,textAlign:"right",color:C.cyan}}>SUM von Extern Cash IN</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.partner} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":"#0c0c1a"}}>
                <td style={{...TD,fontWeight:600,color:C.text}}>{r.partner}</td>
                <td style={{...TD,textAlign:"right",...mono(C.text)}}>{fmt(r.total)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.muted)}}>{fmt(r.ersteRate)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.pink)}}>{fmt(r.externVol)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(r.externCash)}</td>
              </tr>
            ))}
            <tr style={{background:"#09091a",borderTop:`2px solid ${C.border2}`}}>
              <td style={{...TD,fontWeight:700,color:"#fff"}}>Gesamtsumme</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.text)}}>{fmt(sum.total)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.muted)}}>{fmt(sum.ersteRate)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.pink)}}>{fmt(sum.externVol)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.cyan)}}>{fmt(sum.externCash)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function GesamtTable({rows,label}:{rows:PRow[];label:string}) {
    const sum=sumRows(rows);
    return(
      <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
        <div style={{padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.indigo}}/>
          <span style={{fontSize:13,fontWeight:700,color:C.indigo,letterSpacing:"1px"}}>GESAMT</span>
          <span style={{fontSize:12,color:C.muted}}>{label}</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={TH}>Partner</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Total</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Erste Rate</th>
            <th style={{...TH,textAlign:"right",color:C.indigo}}>SUM von SCG Volumen</th>
            <th style={{...TH,textAlign:"right",color:C.cyan}}>SUM von SCG Cash IN</th>
            <th style={{...TH,textAlign:"right",color:C.amber}}>Montano</th>
            <th style={{...TH,textAlign:"right",color:C.amber}}>Cem</th>
            <th style={{...TH,textAlign:"right",color:C.amber}}>Yves</th>
            <th style={{...TH,textAlign:"right",color:C.amber}}>Mert</th>
            <th style={{...TH,textAlign:"right",color:C.amber}}>Kada</th>
            <th style={{...TH,textAlign:"right",color:C.amber}}>Sören</th>
            <th style={{...TH,textAlign:"right",color:C.amber}}>Rene</th>
            <th style={{...TH,textAlign:"right",color:C.green}}>Netto Cash-IN</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.partner} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":"#0c0c1a"}}>
                <td style={{...TD,fontWeight:600,color:C.text}}>{r.partner}</td>
                <td style={{...TD,textAlign:"right",...mono(C.text)}}>{fmt(r.total)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.muted)}}>{fmt(r.ersteRate)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.indigo)}}>{fmt(r.scgVol)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(r.scgCash)}</td>
                <td style={{...TD,textAlign:"right",...mono(r.montano?C.amber:C.dimmed)}}>{fmt(r.montano)}</td>
                <td style={{...TD,textAlign:"right",...mono(r.cem?C.amber:C.dimmed)}}>{fmt(r.cem)}</td>
                <td style={{...TD,textAlign:"right",...mono(r.yves?C.amber:C.dimmed)}}>{fmt(r.yves)}</td>
                <td style={{...TD,textAlign:"right",...mono(r.mert?C.amber:C.dimmed)}}>{fmt(r.mert)}</td>
                <td style={{...TD,textAlign:"right",...mono(r.kada?C.amber:C.dimmed)}}>{fmt(r.kada)}</td>
                <td style={{...TD,textAlign:"right",...mono(r.soeren?C.amber:C.dimmed)}}>{fmt(r.soeren)}</td>
                <td style={{...TD,textAlign:"right",...mono(r.rene?C.amber:C.dimmed)}}>{fmt(r.rene)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.green),fontWeight:600}}>{fmt(nettoOf(r))}</td>
              </tr>
            ))}
            <tr style={{background:"#09091a",borderTop:`2px solid ${C.border2}`}}>
              <td style={{...TD,fontWeight:700,color:"#fff"}}>Gesamtsumme</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.text)}}>{fmt(sum.total)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.muted)}}>{fmt(sum.ersteRate)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.indigo)}}>{fmt(sum.scgVol)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.cyan)}}>{fmt(sum.scgCash)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.amber)}}>{fmt(sum.montano)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.amber)}}>{fmt(sum.cem)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.amber)}}>{fmt(sum.yves)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.amber)}}>{fmt(sum.mert)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.amber)}}>{fmt(sum.kada)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.amber)}}>{fmt(sum.soeren)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.amber)}}>{fmt(sum.rene)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.green)}}>{fmt(nettoOf(sum))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const sideBtn=(active:boolean):React.CSSProperties=>({
    display:"flex",alignItems:"center",justifyContent:"space-between",
    width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:8,
    border:"none",cursor:"pointer",marginBottom:3,
    background:active?"#1a1a30":"transparent",
    color:active?C.text:C.muted,fontSize:13,fontWeight:active?600:400,
  });

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','Inter',sans-serif",display:"flex"}}>
      <div style={{width:220,background:C.sidebar,borderRight:`1px solid ${C.border}`,position:"fixed",top:0,bottom:0,left:0,zIndex:100,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:19,fontWeight:800,letterSpacing:"-0.5px",color:"#fff"}}>HH SCG</div>
          <div style={{fontSize:10,color:C.muted,marginTop:2,letterSpacing:"3px"}}>SALES DASHBOARD</div>
        </div>
        <div style={{padding:"14px 12px 4px"}}>
          <div style={{fontSize:10,color:"#2e2e50",letterSpacing:"2px",marginBottom:6,padding:"0 4px",textTransform:"uppercase"}}>Ansicht</div>
          {([["dashboard","🏠 Übersicht"],["tagesansicht","📅 Tagesansicht"],["wochenansicht","📆 Wochenansicht"],["monatsansicht","📊 Monatsansicht"],["jahresuebersicht","📈 Jahresübersicht"],["closer_intern","👤 Closer Intern"],["closer_extern","👤 Closer Extern"]] as const).map(([t,lbl])=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={sideBtn(activeTab===t)}>
              <span>{lbl}</span>
              {activeTab===t&&<span style={{width:6,height:6,borderRadius:"50%",background:C.indigo,flexShrink:0}}/>}
            </button>
          ))}
        </div>
        <div style={{height:1,background:C.border,margin:"8px 12px"}}/>
        <div style={{padding:"4px 12px"}}>
          <button onClick={()=>setMonthOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 4px",background:"transparent",border:"none",cursor:"pointer",marginBottom:4}}>
            <div style={{fontSize:10,color:"#2e2e50",letterSpacing:"2px",textTransform:"uppercase"}}>Monat</div>
            <span style={{color:"#2e2e50",fontSize:12}}>{monthOpen?"▲":"▼"}</span>
          </button>
          {monthOpen && dynamicMonths.map(m=>(
            <button key={m} onClick={()=>{setSelectedMonth(m);setMonthOpen(false);const t=[...new Set(deals.filter(d=>d.monat===m).map(d=>d.datum))].sort();if(t.length)setSelectedDatum(t[t.length-1]);}} style={sideBtn(selectedMonth===m)}>
              <span>{m}</span>
              {selectedMonth===m&&<span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>}
            </button>
          ))}
          {!monthOpen && (
            <button onClick={()=>setMonthOpen(true)} style={sideBtn(true)}>
              <span>{selectedMonth}</span>
              <span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>
            </button>
          )}
        </div>
        {activeTab==="tagesansicht"&&(<>
          <div style={{height:1,background:C.border,margin:"8px 12px"}}/>
          <div style={{padding:"4px 12px 16px"}}>
            <div style={{fontSize:10,color:"#2e2e50",letterSpacing:"2px",marginBottom:6,padding:"0 4px",textTransform:"uppercase"}}>Datum</div>
            {tageImMonat.map(d=>(
              <button key={d} onClick={()=>setSelectedDatum(d)} style={sideBtn(selectedDatum===d)}>
                <span>{d.slice(0,5)}</span>
                {selectedDatum===d&&<span style={{width:6,height:6,borderRadius:"50%",background:C.amber,flexShrink:0}}/>}
              </button>
            ))}
          </div>
        </>)}
        <div style={{flex:1}}/>
        <div style={{padding:"12px",borderTop:`1px solid ${C.border}`}}>
          <div style={{
            padding:"9px 12px",borderRadius:8,fontSize:11,fontWeight:700,textAlign:"center",
            background: uploadStatus==="success" ? "#0a2a10" : uploadStatus==="error" ? "#0a0a1a" : "#13132a",
            border: `1px solid ${uploadStatus==="success" ? "#1a5a25" : "#252538"}`,
            color: uploadStatus==="success" ? C.green : C.muted,
            letterSpacing:"1px",
          }}>
            {uploadStatus==="success" ? "● LIVE — Google Sheet" : uploadStatus==="error" ? "● Eingebaute Daten" : "⟳ Verbinde..."}
          </div>
          {uploadedDeals && (
            <div style={{marginTop:6,fontSize:10,color:C.muted,textAlign:"center"}}>{uploadedDeals.length} Deals geladen</div>
          )}
          <button onClick={async()=>{
            setUploadStatus("idle");
            try{
              const text=await fetchSheet();
              const parsed=parseCSV(text);
              if(parsed.length>0){setUploadedDeals(parsed);setUploadStatus("success");}
              else{setUploadStatus("error");}
            }catch{setUploadStatus("error");}
          }} style={{marginTop:6,width:"100%",padding:"7px",borderRadius:6,fontSize:11,fontWeight:600,color:"#e8e8f0",background:"#1a1a2e",border:`1px solid #252538`,cursor:"pointer",letterSpacing:"0.5px"}}>
            ↻ Jetzt aktualisieren
          </button>
          <button onClick={()=>setChatOpen(true)} style={{marginTop:6,width:"100%",padding:"9px",borderRadius:6,fontSize:11,fontWeight:700,color:"#818cf8",background:"#0f0f20",border:`1px solid #2a2a50`,cursor:"pointer",letterSpacing:"0.5px"}}>
            🤖 KI-Assistent
          </button>
        </div>
      </div>

      {/* AI Chat Modal */}
      {chatOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)setChatOpen(false);}}>
          <div style={{background:"#0f0f1c",border:`1px solid ${C.border2}`,borderRadius:16,width:520,maxWidth:"90vw",height:600,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.text}}>🤖 KI-Assistent</div>
                <div style={{fontSize:11,color:C.muted}}>Frag mich über deine Sales-Daten</div>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{background:"transparent",border:"none",color:C.muted,fontSize:18,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{flex:1,overflow:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
              {chatMessages.length===0 && (
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                  <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Beispiele:</div>
                  {["Wer ist Top-Closer heute?","Wer ist Top-Partner heute?","Wie war diese Woche?","Vergleiche diese Woche mit letzter Woche","Bester Tag im Mai?","Durchschnitt pro Deal im April","Wie viel fehlt bis 300.000 im Mai?","Wer hat die meisten Deals im April?"].map(q=>(
                    <button key={q} onClick={()=>sendChatMessage(q)} style={{padding:"10px 14px",borderRadius:8,fontSize:12,textAlign:"left",background:"#13132a",border:`1px solid ${C.border}`,color:C.text,cursor:"pointer"}}>
                      💡 {q}
                    </button>
                  ))}
                </div>
              )}
              {chatMessages.map((m,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",gap:4,alignItems:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{
                    maxWidth:"85%",padding:"10px 14px",borderRadius:10,fontSize:13,lineHeight:1.5,
                    background:m.role==="user"?"#1e1e40":"#13132a",
                    color:m.role==="user"?C.indigo:C.text,
                    border:`1px solid ${m.role==="user"?"#2a2a60":C.border}`,
                    whiteSpace:"pre-wrap",
                  }}>{m.content}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{display:"flex",alignItems:"center",gap:8,color:C.muted,fontSize:12}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.indigo,animation:"pulse 1s infinite"}}/>
                  KI denkt nach...
                </div>
              )}
            </div>
            <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
              <input
                value={chatInput}
                onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChatMessage(chatInput);}}}
                placeholder="Frage eingeben..."
                style={{flex:1,padding:"10px 14px",borderRadius:8,fontSize:13,background:"#07070f",border:`1px solid ${C.border2}`,color:C.text,outline:"none"}}
              />
              <button onClick={()=>sendChatMessage(chatInput)} disabled={chatLoading||!chatInput.trim()} style={{padding:"10px 16px",borderRadius:8,fontSize:13,fontWeight:700,background:"#4f46e5",color:"#fff",border:"none",cursor:"pointer",opacity:chatLoading||!chatInput.trim()?0.5:1}}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{marginLeft:220,flex:1,padding:"28px 32px 64px",minWidth:0}}>

        {activeTab==="dashboard"&&(()=>{
          // Today
          const today = new Date();
          const pad = (n:number) => String(n).padStart(2,'0');
          const todayStr = `${pad(today.getDate())}.${pad(today.getMonth()+1)}.${today.getFullYear()}`;
          const todayDeals = deals.filter(d=>d.datum===todayStr);
          const todayCash = todayDeals.reduce((a,d)=>a+d.scgCash,0);
          const todayVol = todayDeals.reduce((a,d)=>a+d.scgVol,0);
          const todayNetto = nettoFromDeals(todayDeals);
          // This month
          const months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
          const curMonth = `${months[today.getMonth()]} ${today.getFullYear()}`;
          const monthDeals = deals.filter(d=>d.monat===curMonth);
          const monthCash = monthDeals.reduce((a,d)=>a+d.scgCash,0);
          const monthVol = monthDeals.reduce((a,d)=>a+d.scgVol,0);
          const monthNetto = nettoFromDeals(monthDeals);
          // This week
          const dow = today.getDay();
          const monday = new Date(today); monday.setDate(today.getDate()-(dow===0?6:dow-1));
          const weekDates: string[] = [];
          const cur = new Date(monday);
          for(let i=0;i<7;i++){weekDates.push(`${pad(cur.getDate())}.${pad(cur.getMonth()+1)}.${cur.getFullYear()}`);cur.setDate(cur.getDate()+1);}
          const weekDeals = deals.filter(d=>weekDates.includes(d.datum));
          const weekCash = weekDeals.reduce((a,d)=>a+d.scgCash,0);
          const weekNetto = nettoFromDeals(weekDeals);
          // Top closer today
          const closerMap: Record<string,number> = {};
          todayDeals.forEach(d=>{const s=(d.setter||"").trim();if(s)closerMap[s]=(closerMap[s]||0)+d.scgVol;});
          const topCloser = Object.entries(closerMap).sort((a,b)=>b[1]-a[1])[0];
          // Top partner today
          const partnerMap: Record<string,number> = {};
          todayDeals.forEach(d=>{partnerMap[d.partner]=(partnerMap[d.partner]||0)+d.scgCash;});
          const topPartner = Object.entries(partnerMap).sort((a,b)=>b[1]-a[1])[0];
          // Last month for comparison
          const lastMonthIdx = today.getMonth()-1;
          const lastMonth = lastMonthIdx>=0 ? `${months[lastMonthIdx]} ${today.getFullYear()}` : `${months[11]} ${today.getFullYear()-1}`;
          const lastMonthCash = deals.filter(d=>d.monat===lastMonth).reduce((a,d)=>a+d.scgCash,0);
          const monthDiff = lastMonthCash>0 ? ((monthCash-lastMonthCash)/lastMonthCash*100) : 0;

          const KPICard = ({title,value,sub,color,icon}:{title:string,value:string,sub?:string,color:string,icon:string}) => (
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderTop:`2px solid ${color}`,borderRadius:12,padding:20}}>
              <div style={{fontSize:11,color:C.muted,letterSpacing:"1px",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                <span>{icon}</span><span>{title}</span>
              </div>
              <div style={{fontSize:22,fontWeight:800,fontFamily:"'DM Mono',monospace",color}}>{value}</div>
              {sub && <div style={{fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}
            </div>
          );

          return (
            <>
              <div style={{marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <h1 style={{margin:0,fontSize:24,fontWeight:800}}>Guten Tag! 👋</h1>
                  <div style={{fontSize:13,color:C.muted,marginTop:4}}>{todayStr} — Live Dashboard</div>
                </div>
                <div style={{padding:"6px 16px",borderRadius:20,background:"#0a1a10",border:"1px solid #1a4a25",fontSize:12,color:C.green,fontWeight:700}}>
                  ● {deals.length} Deals geladen
                </div>
              </div>

              {/* Heute */}
              <div style={{fontSize:11,color:C.muted,letterSpacing:"2px",marginBottom:12,fontWeight:700}}>HEUTE — {todayStr}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:28}}>
                <KPICard title="DEALS HEUTE" value={String(todayDeals.length)} sub="Abgeschlossene Deals" color={C.indigo} icon="📋"/>
                <KPICard title="SCG CASH IN" value={todayCash>0?new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(todayCash):"—"} sub="Heute" color={C.cyan} icon="💰"/>
                <KPICard title="NETTO CASH-IN" value={todayNetto>0?new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(todayNetto):"—"} sub="Nach Provision" color={C.green} icon="✅"/>
                <KPICard title="TOP CLOSER" value={topCloser?topCloser[0]:"—"} sub={topCloser?`${new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(topCloser[1])} Vol.`:"Keine Deals"} color={C.amber} icon="🏆"/>
                <KPICard title="TOP PARTNER" value={topPartner?topPartner[0]:"—"} sub={topPartner?`${new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(topPartner[1])} Cash`:"Keine Deals"} color={C.pink} icon="🏢"/>
              </div>

              {/* Diese Woche */}
              <div style={{fontSize:11,color:C.muted,letterSpacing:"2px",marginBottom:12,fontWeight:700}}>DIESE WOCHE</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:28}}>
                <KPICard title="DEALS" value={String(weekDeals.length)} sub="Diese Woche" color={C.indigo} icon="📋"/>
                <KPICard title="SCG CASH IN" value={new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(weekCash)} sub="Diese Woche" color={C.cyan} icon="💰"/>
                <KPICard title="NETTO" value={new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(weekNetto)} sub="Nach Provision" color={C.green} icon="✅"/>
              </div>

              {/* Dieser Monat */}
              <div style={{fontSize:11,color:C.muted,letterSpacing:"2px",marginBottom:12,fontWeight:700}}>DIESER MONAT — {curMonth}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:28}}>
                <KPICard title="DEALS" value={String(monthDeals.length)} color={C.indigo} icon="📋"/>
                <KPICard title="SCG VOLUMEN" value={new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(monthVol)} color={C.indigo} icon="📊"/>
                <KPICard title="SCG CASH IN" value={new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(monthCash)} color={C.cyan} icon="💰"/>
                <KPICard title="NETTO CASH-IN" value={new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(monthNetto)} sub="Nach Provision" color={C.green} icon="✅"/>
                <KPICard title="VS LETZTER MONAT" value={`${monthDiff>=0?"+":""}${monthDiff.toFixed(1)}%`} sub={`${lastMonth}: ${new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(lastMonthCash)}`} color={monthDiff>=0?C.green:C.pink} icon={monthDiff>=0?"📈":"📉"}/>
              </div>

              {/* Closer Rangliste Monat */}
              <div style={{fontSize:11,color:C.muted,letterSpacing:"2px",marginBottom:12,fontWeight:700}}>CLOSER RANGLISTE — {curMonth}</div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:28}}>
                {(() => {
                  const cm: Record<string,{vol:number,cash:number,cnt:number}> = {};
                  monthDeals.forEach(d=>{const s=(d.setter||"").trim();if(s){if(!cm[s])cm[s]={vol:0,cash:0,cnt:0};cm[s].vol+=d.scgVol;cm[s].cash+=d.scgCash;cm[s].cnt+=1;}});
                  const sorted = Object.entries(cm).sort((a,b)=>b[1].vol-a[1].vol).slice(0,7);
                  const maxVol = sorted[0]?.[1]?.vol || 1;
                  return sorted.map(([name,s],i)=>(
                    <div key={name} style={{padding:"12px 20px",borderBottom:i<sorted.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:24,fontSize:13,fontWeight:700,color:i===0?C.amber:C.muted}}>{i+1}</div>
                      <div style={{width:120,fontSize:13,fontWeight:600,color:C.text}}>{name}</div>
                      <div style={{flex:1,background:"#1a1a2e",borderRadius:4,height:6,overflow:"hidden"}}>
                        <div style={{width:`${(s.vol/maxVol*100).toFixed(0)}%`,height:"100%",background:`linear-gradient(90deg,${C.indigo},${C.cyan})`,borderRadius:4}}/>
                      </div>
                      <div style={{width:120,textAlign:"right",fontSize:12,fontFamily:"'DM Mono',monospace",color:C.cyan}}>{new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(s.vol)}</div>
                      <div style={{width:60,textAlign:"right",fontSize:11,color:C.muted}}>{s.cnt} Deals</div>
                    </div>
                  ));
                })()}
              </div>
            </>
          );
        })()}

        {activeTab==="tagesansicht"&&(<>
          <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <h1 style={{margin:0,fontSize:21,fontWeight:700}}>Tagesansicht</h1>
            <span style={{padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:"#1a1a2e",color:C.amber,border:"1px solid #3a3a20"}}>{selectedDatum}</span>
            <span style={{padding:"3px 12px",borderRadius:20,fontSize:11,background:"#1a1a2e",color:C.muted,border:`1px solid ${C.border}`}}>{selectedMonth}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
            <SumCard label="INTERN" vol={sumRows(tagIntern).internVol} cash={sumRows(tagIntern).internCash} netto={nettoFromDeals(deals.filter(d=>d.datum===selectedDatum&&isInternCloser(d.setter)))} color={C.green} bg="#0a1a10" border="#1a4a25"/>
            <SumCard label="EXTERN" vol={sumRows(tagExtern).externVol} cash={sumRows(tagExtern).externCash} netto={nettoFromDeals(deals.filter(d=>d.datum===selectedDatum&&!isInternCloser(d.setter)))} color={C.pink} bg="#1a0a10" border="#4a1a25"/>
            <SumCard label="GESAMT" vol={sumRows(tagRows).scgVol} cash={sumRows(tagRows).scgCash} netto={nettoFromDeals(deals.filter(d=>d.datum===selectedDatum))} color={C.indigo} bg="#0f0f1c" border="#2a2a50"/>
          </div>
          <InternTable rows={tagIntern} label={selectedDatum}/>
          <ExternTable rows={tagExtern} label={selectedDatum}/>
          <GesamtTable rows={tagRows} label={selectedDatum}/>
        </>)}

        {activeTab==="monatsansicht"&&(<>
          <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
            <h1 style={{margin:0,fontSize:21,fontWeight:700}}>Monatsansicht</h1>
            <span style={{padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:"#1a1a2e",color:C.indigo,border:"1px solid #2a2a50"}}>{selectedMonth}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
            <SumCard label="INTERN" vol={sumRows(monatsIntern).internVol} cash={sumRows(monatsIntern).internCash} netto={nettoFromDeals(deals.filter(d=>d.monat===selectedMonth&&isInternCloser(d.setter)))} color={C.green} bg="#0a1a10" border="#1a4a25"/>
            <SumCard label="EXTERN" vol={sumRows(monatsExtern).externVol} cash={sumRows(monatsExtern).externCash} netto={nettoFromDeals(deals.filter(d=>d.monat===selectedMonth&&!isInternCloser(d.setter)))} color={C.pink} bg="#1a0a10" border="#4a1a25"/>
            <SumCard label="GESAMT" vol={sumRows(monatsRows).scgVol} cash={sumRows(monatsRows).scgCash} netto={nettoFromDeals(deals.filter(d=>d.monat===selectedMonth))} color={C.indigo} bg="#0f0f1c" border="#2a2a50"/>
          </div>
          <InternTable rows={monatsIntern} label={selectedMonth}/>
          <ExternTable rows={monatsExtern} label={selectedMonth}/>
          <GesamtTable rows={monatsRows} label={selectedMonth}/>
        </>)}

        {activeTab==="jahresuebersicht"&&(<>
          <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
            <h1 style={{margin:0,fontSize:21,fontWeight:700}}>Jahresübersicht 2026</h1>
          </div>
          <div style={{...card(),padding:24,marginBottom:28}}>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:"1.5px",marginBottom:20}}>SCG CASH IN · ALLE MONATE</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:160}}>
              {dynamicMonths.map(m=>{
                const rows=aggregate(deals.filter(d=>d.monat===m));
                const cash=rows.reduce((a,r)=>a+r.scgCash,0);
                const maxC=Math.max(...dynamicMonths.map(mm=>aggregate(deals.filter(d=>d.monat===mm)).reduce((a,r)=>a+r.scgCash,0)),1);
                const isSel=m===selectedMonth;
                return(
                  <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>{setSelectedMonth(m);const t=[...new Set(deals.filter(d=>d.monat===m).map(d=>d.datum))].sort();if(t.length)setSelectedDatum(t[t.length-1]);}}>
                    <div style={{fontSize:10,...mono(isSel?C.amber:C.muted)}}>{fmt0(cash)}</div>
                    <div style={{width:"100%",height:Math.max((cash/maxC)*130,3),background:isSel?"linear-gradient(180deg,#818cf8,#4f46e5)":"#1e1e38",borderRadius:"4px 4px 0 0"}}/>
                    <div style={{fontSize:11,color:isSel?C.text:C.muted,fontWeight:isSel?700:400,textAlign:"center"}}>{m.split(" ")[0].slice(0,3)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <th style={TH}>Monat</th>
                <th style={{...TH,textAlign:"right",color:C.indigo}}>SCG Volumen</th>
                <th style={{...TH,textAlign:"right",color:C.cyan}}>SCG Cash IN</th>
                <th style={{...TH,textAlign:"right",color:C.green}}>Intern Vol</th>
                <th style={{...TH,textAlign:"right",color:C.pink}}>Extern Vol</th>
                <th style={{...TH,textAlign:"right"}}>Deals</th>
                <th style={{...TH,textAlign:"right"}}>Cash-Rate</th>
              </tr></thead>
              <tbody>
                {dynamicMonths.map((m,i)=>{
                  const rows=aggregate(deals.filter(d=>d.monat===m));
                  const vol=rows.reduce((a,r)=>a+r.scgVol,0);
                  const cash=rows.reduce((a,r)=>a+r.scgCash,0);
                  const intV=rows.reduce((a,r)=>a+r.internVol,0);
                  const extV=rows.reduce((a,r)=>a+r.externVol,0);
                  const rate=vol>0?cash/vol*100:0;
                  const dealCount=deals.filter(d=>d.monat===m).length;
                  const isSel=m===selectedMonth;
                  return(
                    <tr key={m} onClick={()=>{setSelectedMonth(m);const t=[...new Set(deals.filter(d=>d.monat===m).map(d=>d.datum))].sort();if(t.length)setSelectedDatum(t[t.length-1]);}} style={{borderBottom:`1px solid ${C.border}`,background:isSel?"#13132a":i%2===0?"transparent":"#0c0c1a",cursor:"pointer"}}>
                      <td style={{...TD,fontWeight:isSel?700:600,color:isSel?C.indigo:C.text}}>{m}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.indigo)}}>{fmt(vol)}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(cash)}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.green)}}>{fmt(intV)}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.pink)}}>{fmt(extV)}</td>
                      <td style={{...TD,textAlign:"right",color:C.muted}}>{dealCount}</td>
                      <td style={{...TD,textAlign:"right"}}><span style={{padding:"2px 9px",borderRadius:12,background:rate>=70?"#0d2a1a":rate>=55?"#1a2a10":"#2a1a10",color:rate>=70?C.green:rate>=55?"#84cc16":C.amber,fontSize:12,fontWeight:600}}>{rate.toFixed(1)}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <GesamtTable rows={jahresRows} label="Gesamtes Jahr 2026"/>
        </>)}

        {(activeTab==="closer_intern"||activeTab==="closer_extern")&&(()=>{
          const isIntern = activeTab==="closer_intern";
          const closerColor: Record<string,string> = {
            Montano:C.indigo, Cem:C.green, Yves:C.amber, Mert:C.pink,
            Kada:C.cyan, Sören:"#a78bfa", Rene:"#fb923c"
          };
          const INTERN_CLOSERS = ["Montano","Cem","Yves","Mert","Kada","Sören","Rene"];
          const INTERN_NO_PROVI = ["Petrit","Henrik"];
          const tageInMonat = [...new Set(deals.filter(d=>d.monat===selectedMonth).map(d=>d.datum))].sort();
          const filterDeals = closerView==="tag"
            ? deals.filter(d=>d.datum===selectedDatum)
            : deals.filter(d=>d.monat===selectedMonth);

          const headerSection = (
            <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <h1 style={{margin:0,fontSize:21,fontWeight:700}}>{isIntern?"Closer Intern":"Closer Extern"}</h1>
              <select value={selectedMonth} onChange={e=>{setSelectedMonth(e.target.value);const t=[...new Set(deals.filter(d=>d.monat===e.target.value).map(d=>d.datum))].sort();if(t.length)setSelectedDatum(t[t.length-1]);}} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,background:"#1a1a2e",color:C.indigo,border:"1px solid #2a2a50",cursor:"pointer",outline:"none"}}>
                {dynamicMonths.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
              <div style={{display:"flex",gap:4,background:"#0f0f1c",borderRadius:20,padding:3,border:`1px solid ${C.border}`}}>
                {(["monat","tag"] as const).map(v=>(
                  <button key={v} onClick={()=>setCloserView(v)} style={{padding:"4px 14px",borderRadius:16,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",background:closerView===v?"#252550":"transparent",color:closerView===v?C.indigo:C.muted}}>
                    {v==="monat"?"Monat":"Tag"}
                  </button>
                ))}
              </div>
              {closerView==="tag" && (
                <select value={selectedDatum} onChange={e=>setSelectedDatum(e.target.value)} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,background:"#1a1a2e",color:C.amber,border:"1px solid #3a3a20",cursor:"pointer",outline:"none"}}>
                  {tageInMonat.map(d=><option key={d} value={d}>{d.slice(0,5)}</option>)}
                </select>
              )}
            </div>
          );

          if (isIntern) {
            return (
              <>
                {headerSection}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                  {INTERN_CLOSERS.map(name=>{
                    const key = name === "Sören" ? "soeren" : name.toLowerCase();
                    const relevant = filterDeals.filter(d => { const v=(d as Record<string,unknown>)[key]; return isInternCloser(d.setter) && typeof v==="number" && v>0; });
                    if (relevant.length===0) return null;
                    const provi = relevant.reduce((a,d)=>{const v=(d as Record<string,unknown>)[key];return a+(typeof v==="number"?v:0);},0);
                    const scgVol = relevant.reduce((a,d)=>a+d.scgVol,0);
                    const scgCash = relevant.reduce((a,d)=>a+d.scgCash,0);
                    const color = closerColor[name] || C.indigo;
                    return (
                      <div key={name} style={{background:C.card,border:`1px solid ${C.border}`,borderTop:`2px solid ${color}`,borderRadius:12,padding:18}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:`${color}22`,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color}}>{name[0]}</div>
                          <div>
                            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{name}</div>
                            <div style={{fontSize:11,color:C.muted}}>{relevant.length} Deals</div>
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <div style={{background:"#0f0f20",borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:C.indigo,letterSpacing:"1px",fontWeight:600}}>SCG VOLUMEN</span>
                            <span style={{fontSize:13,fontWeight:700,...mono(C.indigo)}}>{fmt(scgVol)}</span>
                          </div>
                          <div style={{background:"#0a1020",borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:C.cyan,letterSpacing:"1px",fontWeight:600}}>SCG CASH IN</span>
                            <span style={{fontSize:13,fontWeight:700,...mono(C.cyan)}}>{fmt(scgCash)}</span>
                          </div>
                          <div style={{background:"#0a1a10",borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:C.green,letterSpacing:"1px",fontWeight:600}}>PROVISION</span>
                            <span style={{fontSize:13,fontWeight:700,...mono(C.green)}}>{fmt(provi)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {INTERN_NO_PROVI.map(name=>{
                    const relevant = filterDeals.filter(d => isInternCloser(d.setter) && (d.setter||"").trim()===name);
                    if (relevant.length===0) return null;
                    const scgVol = relevant.reduce((a,d)=>a+d.scgVol,0);
                    const scgCash = relevant.reduce((a,d)=>a+d.scgCash,0);
                    const color = "#94a3b8";
                    return (
                      <div key={name} style={{background:C.card,border:`1px solid ${C.border}`,borderTop:`2px solid ${color}`,borderRadius:12,padding:18}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:`${color}22`,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color}}>{name[0]}</div>
                          <div>
                            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{name}</div>
                            <div style={{fontSize:11,color:C.muted}}>{relevant.length} Deals</div>
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <div style={{background:"#0f0f20",borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:C.indigo,letterSpacing:"1px",fontWeight:600}}>SCG VOLUMEN</span>
                            <span style={{fontSize:13,fontWeight:700,...mono(C.indigo)}}>{fmt(scgVol)}</span>
                          </div>
                          <div style={{background:"#0a1020",borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:C.cyan,letterSpacing:"1px",fontWeight:600}}>SCG CASH IN</span>
                            <span style={{fontSize:13,fontWeight:700,...mono(C.cyan)}}>{fmt(scgCash)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          } else {
            const externDeals = filterDeals.filter(d => {
              const setter = (d.setter||"").trim();
              return setter && !isInternCloser(setter) && setter !== "Closer";
            });
            const closerMap: Record<string,{scgVol:number,scgCash:number,deals:number}> = {};
            externDeals.forEach(d => {
              const name = (d.setter||"").trim();
              if (!name || name==="Closer") return;
              if (!closerMap[name]) closerMap[name] = {scgVol:0,scgCash:0,deals:0};
              closerMap[name].scgVol += d.scgVol;
              closerMap[name].scgCash += d.scgCash;
              closerMap[name].deals += 1;
            });
            const closers = Object.entries(closerMap).sort((a,b)=>b[1].scgCash-a[1].scgCash);
            return (
              <>
                {headerSection}
                {closers.length===0 && <div style={{color:C.muted,fontSize:14}}>Keine externen Deals</div>}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                  {closers.map(([name,s],i)=>{
                    const colors = [C.indigo,C.green,C.amber,C.pink,C.cyan,"#a78bfa","#fb923c","#38bdf8","#f43f5e","#84cc16"];
                    const color = colors[i % colors.length];
                    return (
                      <div key={name} style={{background:C.card,border:`1px solid ${C.border}`,borderTop:`2px solid ${color}`,borderRadius:12,padding:18}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:`${color}22`,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color}}>{name[0]}</div>
                          <div>
                            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{name}</div>
                            <div style={{fontSize:11,color:C.muted}}>{s.deals} Deals</div>
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <div style={{background:"#0f0f20",borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:C.indigo,letterSpacing:"1px",fontWeight:600}}>SCG VOLUMEN</span>
                            <span style={{fontSize:13,fontWeight:700,...mono(C.indigo)}}>{fmt(s.scgVol)}</span>
                          </div>
                          <div style={{background:"#0a1020",borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:C.cyan,letterSpacing:"1px",fontWeight:600}}>SCG CASH IN</span>
                            <span style={{fontSize:13,fontWeight:700,...mono(C.cyan)}}>{fmt(s.scgCash)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          }
        })()}
      </div>
    </div>
  );
}
