const pool = require('../../db/mysql');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'category-controller' },
  transports: [
    new winston.transports.File({ filename: 'logs/category.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  
  // Validate input
  if (!id || isNaN(id)) {
    logger.warn(`Invalid category ID provided: ${id}`);
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid category ID' 
    });
  }
  
  let connection;
  
  try {
    // Get connection from pool
    connection = await pool.promise().getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    // Check if category exists and has products
    const [categoryCheck] = await connection.execute(
      'SELECT id FROM category WHERE id = ?',
      [id]
    );
    
    if (categoryCheck.length === 0) {
      await connection.rollback();
      logger.info(`Category not found for deletion: ${id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    // Check if category has products
    const [productCheck] = await connection.execute(
      'SELECT COUNT(*) as count FROM product WHERE category_id = ?',
      [id]
    );
    
    if (productCheck[0].count > 0) {
      await connection.rollback();
      logger.warn(`Attempted to delete category with products: ${id}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with existing products' 
      });
    }
    
    // Delete category using prepared statement
    const [result] = await connection.execute(
      'DELETE FROM category WHERE id = ?',
      [id]
    );
    
    // Commit transaction
    await connection.commit();
    
    logger.info(`Category deleted successfully: ${id}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Category deleted successfully',
      deletedId: id
    });
    
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        logger.error('Error rolling back transaction:', rollbackError);
      }
    }
    
    logger.error('Error deleting category:', {
      error: error.message,
      stack: error.stack,
      categoryId: id
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  } finally {
    // Release connection back to pool
    if (connection) {
      connection.release();
    }
  }
}

module.exports = deleteCategory;