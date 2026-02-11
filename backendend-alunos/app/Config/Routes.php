<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->resource('alunos', ['controller' => 'AlunosController']);
$routes->post('alunos/update/(:num)', 'AlunosController::update/$1');

$routes->post('auth/login', 'AuthController::login');
$routes->post('auth/register', 'AuthController::register');