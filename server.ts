import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data Systems
  const mockAlerts = [
    { id: 'AL-001', type: 'Multiple GSTIN Collision', severity: 'Critical', district: 'Peenya Hub', time: '2m ago', evidence: '3 identical entities found under different PAN IDs.' },
    { id: 'AL-002', type: 'License Expiry Prediction', severity: 'High', district: 'Mysuru', time: '1h ago', evidence: '80% probability of manufacturing license lapse for 12 units.' },
    { id: 'AL-003', type: 'Silent Shutdown', severity: 'Medium', district: 'Hassan', time: '4h ago', evidence: 'Zero electricity consumption detected for 90 days.' }
  ];

  const mockReviewQueue = [
    { id: 'RV-101', type: 'Candidate Merge', businessA: 'Peenya Tools Ltd', businessB: 'Peenya Precision Tools', confidence: 0.94, reason: 'Name similarity + Address match' },
    { id: 'RV-102', type: 'Cluster Split', businessA: 'Agro Exports Group', clusterSize: 5, confidence: 0.42, reason: 'Temporal ownership conflict detected' }
  ];

  const mockAuditLogs = [
    { id: 'LOG-001', user: 'Dr. Patil', action: 'Approved Merge', target: 'UBID-KA-560001', timestamp: new Date().toISOString() },
    { id: 'LOG-002', user: 'Officer Rao', action: 'Viewed Sensitive PII', target: 'UBID-KA-570002', timestamp: new Date().toISOString() }
  ];

  // Graph Service
  app.get("/api/graph/business/:ubid", (req, res) => {
    res.json({
      nodes: [
        { id: '1', data: { label: 'Primary UBID' }, type: 'input', position: { x: 250, y: 5 } },
        { id: '2', data: { label: 'Trade License' }, position: { x: 100, y: 100 } },
        { id: '3', data: { label: 'Utility Account' }, position: { x: 400, y: 100 } },
        { id: '4', data: { label: 'Legacy PAN Record' }, position: { x: 250, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', label: 'HAS_LICENSE' },
        { id: 'e1-3', source: '1', target: '3', label: 'HAS_UTILITY' },
        { id: 'e1-4', source: '1', target: '4', label: 'LINKED_CANDIDATE', animated: true },
      ]
    });
  });

  // Reviewer Workbench
  app.get("/api/reviews/queue", (req, res) => res.json(mockReviewQueue));
  
  // Alert Center
  app.get("/api/alerts", (req, res) => res.json(mockAlerts));

  // Governance
  app.get("/api/governance/audit", (req, res) => res.json(mockAuditLogs));

  // Business Registration (Mutation)
  app.post("/api/businesses/register", (req, res) => {
    const newBusiness = { ...req.body, ubid: `UBID-KA-${Math.floor(Math.random() * 900000 + 100000)}`, status: 'Active' };
    res.status(201).json(newBusiness);
  });

  // Mock Business Data API
  app.get("/api/businesses", (req, res) => {
    // For MVP: Return mock data that mirrors the suggested core tables
    res.json([
      {
        ubid: "UBID-KA-560001-A12",
        name: "Peenya Precision Works",
        status: "Active",
        district: "Bengaluru Urban",
        healthScore: 88,
        riskScore: 12,
        lastInspection: "2024-03-15",
        sector: "Manufacturing",
      },
      {
        ubid: "UBID-KA-570002-B45",
        name: "Hassan Agro Exports",
        status: "Dormant",
        district: "Hassan",
        healthScore: 45,
        riskScore: 68,
        lastInspection: "2022-11-20",
        sector: "Agriculture",
      }
    ]);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KBDT Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
