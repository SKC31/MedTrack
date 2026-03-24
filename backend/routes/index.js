const express = require('express');
const router  = express.Router();

const { authenticate, authorize } = require('../middleware/auth');

const authCtrl        = require('../controllers/authController');
const equipmentCtrl   = require('../controllers/equipmentController');
const maintenanceCtrl = require('../controllers/maintenanceController');
const faultCtrl       = require('../controllers/faultController');
const usersCtrl       = require('../controllers/usersController');

// ── Auth ─────────────────────────────────────────────────────────────────────
router.post('/auth/login', authCtrl.login);
router.get ('/auth/me',    authenticate, authCtrl.me);

// ── Equipment ─────────────────────────────────────────────────────────────────
router.get   ('/equipment',     authenticate, equipmentCtrl.getAll);
router.get   ('/equipment/:id', authenticate, equipmentCtrl.getById);
router.post  ('/equipment',     authenticate, authorize('admin'), equipmentCtrl.create);
router.patch ('/equipment/:id', authenticate, authorize('admin'), equipmentCtrl.update);
router.delete('/equipment/:id', authenticate, authorize('admin'), equipmentCtrl.remove);

// ── Maintenance ───────────────────────────────────────────────────────────────
router.get   ('/maintenance',            authenticate, maintenanceCtrl.getAll);
router.get   ('/maintenance/:id',        authenticate, maintenanceCtrl.getById);
router.post  ('/maintenance',            authenticate, authorize('admin'), maintenanceCtrl.create);
router.patch ('/maintenance/:id/status', authenticate, maintenanceCtrl.updateStatus);
router.delete('/maintenance/:id',        authenticate, authorize('admin'), maintenanceCtrl.remove);

// ── Fault Reports ─────────────────────────────────────────────────────────────
router.get   ('/faults',            authenticate, faultCtrl.getAll);
router.get   ('/faults/:id',        authenticate, faultCtrl.getById);
router.post  ('/faults',            authenticate, faultCtrl.create);
router.patch ('/faults/:id/status', authenticate, authorize('admin'), faultCtrl.updateStatus);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get   ('/users',     authenticate, authorize('admin'), usersCtrl.getAll);
router.post  ('/users',     authenticate, authorize('admin'), usersCtrl.create);
router.delete('/users/:id', authenticate, authorize('admin'), usersCtrl.remove);

module.exports = router;
