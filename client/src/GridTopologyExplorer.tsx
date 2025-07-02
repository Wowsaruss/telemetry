import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Node {
  id: string;
  coordinates: [number, number];
  properties: Record<string, any>;
}
interface Edge {
  id: string;
  coordinates: [number, number][];
  properties: Record<string, any>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GridTopologyExplorer() {
  const [geojson, setGeojson] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    setNodes([]);
    setEdges([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/grid-topology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'geojson', data: geojson })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse');
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate map center
  const allCoords = [
    ...nodes.map(n => n.coordinates),
    ...edges.flatMap(e => e.coordinates)
  ];
  const mapCenter = allCoords.length
    ? [
      allCoords.reduce((sum, c) => sum + c[1], 0) / allCoords.length,
      allCoords.reduce((sum, c) => sum + c[0], 0) / allCoords.length
    ]
    : [39.5, -98.35]; // US center

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>Grid Topology Explorer</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Paste GeoJSON</Typography>
        <TextField
          label="GeoJSON"
          multiline
          minRows={6}
          value={geojson}
          onChange={e => setGeojson(e.target.value)}
          fullWidth
          sx={{ my: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !geojson}>
          {loading ? 'Parsing...' : 'Parse & Visualize'}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      {(nodes.length > 0 || edges.length > 0) && (
        <>
          <Typography variant="h6" gutterBottom>Map Visualization</Typography>
          <Box sx={{ height: 400, mb: 3 }}>
            <MapContainer center={mapCenter as [number, number]} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {nodes.map(node => (
                <Marker key={node.id} position={[node.coordinates[1], node.coordinates[0]]}>
                  <Popup>
                    <strong>{node.id}</strong><br />
                    {Object.entries(node.properties).map(([k, v]) => (
                      <span key={k}><strong>{k}:</strong> {String(v)}<br /></span>
                    ))}
                  </Popup>
                </Marker>
              ))}
              {edges.map(edge => (
                <Polyline
                  key={edge.id}
                  positions={edge.coordinates.map(([lng, lat]) => [lat, lng])}
                  color="blue"
                >
                  <Popup>
                    <strong>{edge.id}</strong><br />
                    {Object.entries(edge.properties).map(([k, v]) => (
                      <span key={k}><strong>{k}:</strong> {String(v)}<br /></span>
                    ))}
                  </Popup>
                </Polyline>
              ))}
            </MapContainer>
          </Box>
          <Typography variant="h6" gutterBottom>Nodes</Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Coordinates</TableCell>
                  <TableCell>Properties</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nodes.map(node => (
                  <TableRow key={node.id}>
                    <TableCell>{node.id}</TableCell>
                    <TableCell>{node.coordinates.join(', ')}</TableCell>
                    <TableCell>
                      {Object.entries(node.properties).map(([k, v]) => (
                        <span key={k}><strong>{k}:</strong> {String(v)}; </span>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" gutterBottom>Edges</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Coordinates</TableCell>
                  <TableCell>Properties</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {edges.map(edge => (
                  <TableRow key={edge.id}>
                    <TableCell>{edge.id}</TableCell>
                    <TableCell>
                      {edge.coordinates.map((c, i) => (
                        <span key={i}>{c.join(', ')}; </span>
                      ))}
                    </TableCell>
                    <TableCell>
                      {Object.entries(edge.properties).map(([k, v]) => (
                        <span key={k}><strong>{k}:</strong> {String(v)}; </span>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
} 