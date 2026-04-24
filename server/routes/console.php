<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment('Keep shipping with purpose.');
})->purpose('Display a motivational quote');
